import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import passwordGenerator from 'generate-password';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, UpdateResult } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { LoggerService } from '../../logger/services/logger.service';
import { ScreenTracking } from '../../user/screen-tracking/entities/screen-tracking.entity';
import { Roles } from '../roles/entities/roles.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { AdminJwtPayload, UserJwtPayload } from '../types/jwt-payload.types';
import { UserService } from '../../user/services/user.service';
import { AdminForgotPasswordDto } from '../validation/admin-forgot-password.dto';
import { ConfigService } from '@nestjs/config';
import { NunjucksService } from '../../html-parser/services/nunjucks.service';
import { SendGridService } from '../../email/services/sendgrid.service';
import { Merchant } from 'src/admin/merchant/entities/merchant.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ScreenTracking)
    private readonly screenTrackingRepository: Repository<ScreenTracking>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly nunjucksService: NunjucksService,
    private readonly mailService: SendGridService,
  ) {}

  async validateAdminUser(email: string, password: string): Promise<Admin> {
    this.logger.log(
      'Validating credentials for admin user with email:',
      `${AuthenticationService.name}#validateUser`,
      undefined,
      email,
    );

    const user: Admin | null = await this.adminRepository.findOne({
      where: {
        email,
      },
      relations: ['role', 'merchant'],
    });

    if (!user) {
      this.logger.error(
        `User with email ${email} not found`,
        `${AuthenticationService.name}#validateUser`,
      );
      return null;
    }

    const passwordMatch = await bcrypt.compare(password.trim(), user.password);
    if (!passwordMatch) {
      this.logger.error(
        `Password for admin user with email ${email} doesn't match`,
        `${AuthenticationService.name}#validateUser`,
      );
      return null;
    }

    delete user.password;
    this.logger.log(
      'Credentials validated.',
      `${AuthenticationService.name}#validateUser`,
      undefined,
      user,
    );
    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    this.logger.log(
      'Validating credentials for user with email:',
      `${AuthenticationService.name}#validateUser`,
      undefined,
      email,
    );

    const user: User = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['role'],
    });

    if (!user) {
      this.logger.error(
        `User with email ${email} not found`,
        `${AuthenticationService.name}#validateUser`,
      );
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      this.logger.error(
        `Password for user with email ${email} doesn't match`,
        `${AuthenticationService.name}#validateUser`,
      );
      return null;
    }

    delete user.password;
    this.logger.log(
      'Credentials validated.',
      `${AuthenticationService.name}#validateUser`,
      undefined,
      user,
    );
    return user;
  }

  async generateJwt(user: User | Admin, requestId: string) {
    this.logger.log(
      'Generating JWT token for user id:',
      `${AuthenticationService.name}#generateJwt`,
      undefined,
      user.id,
    );

    // admin and merchant login
    let payload: AdminJwtPayload | UserJwtPayload;
    if ('userName' in user) {
      user as Admin;
      payload = {
        id: user.id,
        email: user.email,
        userName: user.userName,
        merchant: (user.merchant as Merchant).id,
        role: (user?.role as Roles)?.roleName,
      };
    } else {
      // user login
      user as User;
      const screenTracking = await this.screenTrackingRepository.findOne({
        where: {
          user: user.id,
        },
      });
      if (!screenTracking) {
        throw new UnauthorizedException();
      }

      payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        screenTracking: screenTracking.id,
        role: (user.role as Roles).roleName,
      };
    }

    const jwt: string = this.jwtService.sign(payload);
    this.logger.log(
      `JWT token for user id ${user.id} generated`,
      `${AuthenticationService.name}#generateJwt`,
      undefined,
      jwt,
    );

    const response: {
      id: string;
      email: string;
      role: string;
      token: string;
      userName?: string;
      firstName?: string;
      lastName?: string;
      merchant?: string;
    } = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      token: jwt,
    };
    if ('userName' in payload) {
      response.userName = payload.userName;
    }
    if ('firstName' in payload) {
      response.firstName = payload.firstName;
    }
    if ('lastName' in payload) {
      response.lastName = payload.lastName;
    }
    if ('merchant' in payload) {
      response.merchant = payload.merchant;
    }

    return response;
  }

  async generateCustomerUpdateToken(
    email: string,
    requestId: string,
  ): Promise<{ user: User; token: string }> {
    this.logger.log(
      'Generating a token to CustomerUpdateToken with arguments',
      `${AuthenticationService.name}#generateCustomerUpdateToken`,
      requestId,
      email,
    );

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      const errorMessage = 'Invalid email';
      this.logger.error(
        errorMessage,
        `${AuthenticationService.name}#generateCustomerUpdateToken`,
        requestId,
      );

      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const oneDayInMillis = 1000 * 60 * 60 * 24;
    const tokenExpires = new Date(Date.now() + oneDayInMillis);

    await this.userRepository.update(
      { email },
      {
        customerUpdateToken: hashedToken,
        customerUpdateTokenExpires: tokenExpires,
      },
    );

    this.logger.log(
      'Token generated successfully:',
      `${AuthenticationService.name}#CustomerUpdateToken`,
      requestId,
      token,
    );

    return { user, token };
  }

  async generateResetPasswordToken(
    email: string,
    requestId: string,
  ): Promise<{ user: User; token: string }> {
    this.logger.log(
      'Generating a token to reset password with arguments',
      `${AuthenticationService.name}#generateResetPasswordToken`,
      requestId,
      email,
    );

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      const errorMessage = 'Invalid email';
      this.logger.error(
        errorMessage,
        `${AuthenticationService.name}#generateResetPasswordToken`,
        requestId,
      );

      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const oneDayInMillis = 1000 * 60 * 60 * 24;
    const tokenExpires = new Date(Date.now() + oneDayInMillis);

    await this.userRepository.update(
      { email },
      {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpires: tokenExpires,
      },
    );

    this.logger.log(
      'Token generated successfully:',
      `${AuthenticationService.name}#generateResetPasswordToken`,
      requestId,
      token,
    );

    return { user, token };
  }

  async resetPasswordByToken(
    token: string,
    password: string,
    requestId: string,
  ) {
    this.logger.log(
      `Setting a new password for token ${token}`,
      `${AuthenticationService.name}#setPasswordByToken`,
      requestId,
      token,
    );
    const hashedPassword = await this.userService.encryptPassword(password);
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const updateUserResponse: UpdateResult = await this.userRepository.update(
      {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpires: MoreThan(new Date()),
      },
      {
        resetPasswordToken: null,
        resetPasswordTokenExpires: null,
        password: hashedPassword,
      },
    );

    if (updateUserResponse.affected < 1) {
      const errorMessage = `Invalid token`;
      this.logger.error(
        errorMessage,
        `${AuthenticationService.name}#setPasswordByToken`,
        requestId,
        token,
      );
      throw new BadRequestException(undefined, errorMessage);
    }

    return true;
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    requestId: string,
  ) {
    this.logger.log(
      `Changing password for user id ${userId}`,
      `${AuthenticationService.name}#adminChangePassword`,
      requestId,
    );

    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      const errorMessage = `User id ${userId} not found`;
      this.logger.error(
        errorMessage,
        `${AuthenticationService.name}#changePassword`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const oldPasswordCorrect = await bcrypt.compare(
      oldPassword.trim(),
      user.password,
    );
    if (!oldPasswordCorrect) {
      const errorMessage = 'Incorrect password';
      throw new BadRequestException(undefined, errorMessage);
    }

    const newPassEncrypted = await this.userService.encryptPassword(
      newPassword,
    );

    await this.userRepository.update(
      { id: userId },
      { password: newPassEncrypted },
    );
    this.logger.log(
      `Password changed for user id ${userId}`,
      `${AuthenticationService.name}#changePassword`,
      requestId,
    );
  }

  async adminChangePassword(
    adminId: string,
    oldPassword: string,
    newPassword: string,
    requestId: string,
  ) {
    this.logger.log(
      `Changing password for admin user id ${adminId}`,
      `${AuthenticationService.name}#adminChangePassword`,
      requestId,
    );

    const admin = await this.adminRepository.findOne({ id: adminId });
    if (!admin) {
      const errorMessage = `User id ${adminId} not found`;
      this.logger.error(
        errorMessage,
        `${AuthenticationService.name}#adminChangePassword`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const oldPasswordCorrect = await bcrypt.compare(
      oldPassword.trim(),
      admin.password,
    );

    if (!oldPasswordCorrect) {
      const errorMessage = 'Incorrect password';
      throw new BadRequestException(undefined, errorMessage);
    }

    const newPassEncrypted = await this.userService.encryptPassword(
      newPassword,
    );
    await this.adminRepository.update(
      { id: adminId },
      { password: newPassEncrypted },
    );

    this.logger.log(
      `Password changed for admin user id ${adminId}`,
      `${AuthenticationService.name}#adminChangePassword`,
      requestId,
    );
  }

  async adminForgotPassword(
    adminForgotPasswordDto: AdminForgotPasswordDto,
    requestId: string,
  ) {
    this.logger.log(
      `Resetting password for admin with email ${adminForgotPasswordDto.email}`,
      `${AuthenticationService.name}#setPasswordByToken`,
      requestId,
    );
    const admin: Admin | null = await this.adminRepository.findOne({
      where: {
        email: adminForgotPasswordDto.email,
      },
    });

    if (!admin) {
      const errorMessage = 'Invalid email';
      this.logger.error(
        errorMessage,
        `${AuthenticationService.name}#adminForgotPassword`,
        requestId,
      );

      throw new UnauthorizedException();
    }

    const newPassword: string = await this.generateRandomPassword();
    admin.password = await this.generateEncryptedPassword(newPassword);
    await this.adminRepository.update(
      { id: admin.id },
      { password: admin.password },
    );

    const baseUrl = this.configService.get<string>('baseUrl');
    const html = await this.nunjucksService.htmlToString(
      'emails/admin-reset-password.html',
      {
        link: `${baseUrl}/admin/login`,
        password: newPassword,
        userName: admin.userName,
      },
    );
    const subject = 'Password reset request';
    const from = 'Mirza <support-mirza@heymirza.com>';
    const to = admin.email;

    await this.mailService.sendEmail(from, to, subject, html, requestId);
    this.logger.log(
      `Password for admin with email ${adminForgotPasswordDto.email} has been reset`,
      `${AuthenticationService.name}#adminForgotPassword`,
      requestId,
    );
  }

  async generateEncryptedPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async generateRandomPassword(): Promise<string> {
    return passwordGenerator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      strict: true,
    });
  }
}
