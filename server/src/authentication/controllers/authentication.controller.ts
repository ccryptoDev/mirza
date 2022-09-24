import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { Role } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/guards/roles.guard';
import { LoggerService } from '../../logger/services/logger.service';
import { AdminAuthGuard } from '../strategies/admin-local-auth.guard';
import { AuthenticationService } from '../services/authentication.service';
import { LocalAuthGuard } from '../strategies/local-auth.guard';
import { SendGridService } from '../../email/services/sendgrid.service';
import { NunjucksService } from '../../html-parser/services/nunjucks.service';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from '../validation/change-password.dto';
import { AdminJwtPayload } from '../types/jwt-payload.types';
import { JwtAuthGuard } from '../strategies/jwt-auth.guard';
import { AdminForgotPasswordDto } from '../validation/admin-forgot-password.dto';
import {
  LogActivityService,
  logActivityModuleNames,
} from '../../admin/log-activity/services/log-activity.service';
import { LoginDto } from '../validation/login.dto';
import { ApplicationLoginResponse } from '../types/application-login-response';
import { BadRequestResponse } from 'src/types/bad-request-response';
import { ErrorResponse } from 'src/types/error-response';
import { AdminLoginResponse } from '../types/admin-login';

@Controller('/api')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly logger: LoggerService,
    private readonly mailService: SendGridService,
    private readonly nunjucksService: NunjucksService,
    private readonly configService: ConfigService,
    private readonly logActivityService: LogActivityService,
  ) {}

  @ApiCreatedResponse({ type: ApplicationLoginResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(LocalAuthGuard)
  @Post('application/login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Req() request: any, @Body() loginDto: LoginDto) {
    try {
      const response: {
        token: string;
        role: string;
      } = await this.authService.generateJwt(request.user, request.id);
      this.logger.log(
        'Response status 201',
        `${AuthenticationController.name}#login`,
        undefined,
        response,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AuthenticationController.name}#login`,
        undefined,
        error,
      );
      throw error;
    }
  }

  @ApiCreatedResponse({ type: AdminLoginResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(AdminAuthGuard)
  @Post('admin/login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async adminLogin(@Req() request: any, @Body() loginDto: LoginDto) {
    try {
      const response: {
        token: string;
        role: string;
      } = await this.authService.generateJwt(request.user, request.id);

      const { id, userName, email, phoneNumber, role, createdAt, merchant } =
        request.user;
      await this.logActivityService.createLogActivity(
        request,
        logActivityModuleNames.LOGIN,
        `${request.user.email} - User logged in`,
        {
          id,
          createdAt,
          email,
          phoneNumber,
          role,
          userName,
          merchantId: merchant,
        },
      );

      this.logger.log(
        'Response status 201',
        `${AuthenticationController.name}#adminLogin`,
        undefined,
        response,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AuthenticationController.name}#adminLogin`,
        undefined,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @HttpCode(204)
  @Post('application/closeLoanDetails')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async closeLoanDetails(
    @Req() request: Request & { user: AdminJwtPayload },
    @Body('email') email: string,
  ) {
    try {
      const response = await this.authService.generateCustomerUpdateToken(
        email,
        request.id,
      );

      if (!response) {
        return;
      }

      const { user, token } = response;
      const baseUrl = this.configService.get<string>('baseUrl');
      const html = await this.nunjucksService.htmlToString(
        'emails/application-closeloan.html',
        {
          userName: user.firstName,
          link: `${baseUrl}/close-loan/${token}`,
        },
      );
      const subject = 'Closing Loan Request';
      const from = 'Mirza <support-mirza@heymirza.com>';
      const to = user.email;

      await this.mailService.sendEmail(from, to, subject, html, request.id);

      this.logger.log(
        'Response status 204',
        `${AuthenticationController.name}#updateCustomerDetails`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AuthenticationController.name}#updateCustomerDetails`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @HttpCode(204)
  @Post('application/updatecustomerdetails')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateCustomerDetails(
    @Req() request: Request & { user: AdminJwtPayload },
    @Body('email') email: string,
  ) {
    try {
      const response = await this.authService.generateCustomerUpdateToken(
        email,
        request.id,
      );

      if (!response) {
        return;
      }

      const { user, token } = response;
      const baseUrl = this.configService.get<string>('baseUrl');
      const html = await this.nunjucksService.htmlToString(
        'emails/application-updateinfo.html',
        {
          userName: user.firstName,
          link: `${baseUrl}/update-customerdetails/${token}`,
        },
      );
      const subject = 'Update SSN/Annual income Request';
      const from = 'Mirza <support-mirza@heymirza.com>';
      const to = user.email;

      await this.mailService.sendEmail(from, to, subject, html, request.id);

      this.logger.log(
        'Response status 204',
        `${AuthenticationController.name}#updateCustomerDetails`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AuthenticationController.name}#updateCustomerDetails`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @HttpCode(204)
  @Post('application/forgotPassword')
  async forgotPassword(
    @Req() request: Request & { user: AdminJwtPayload },
    @Body('email') email: string,
  ) {
    try {
      const response = await this.authService.generateResetPasswordToken(
        email,
        request.id,
      );

      if (!response) {
        return;
      }

      const { user, token } = response;
      const baseUrl = this.configService.get<string>('baseUrl');
      const html = await this.nunjucksService.htmlToString(
        'emails/forgot-password.html',
        {
          userName: user.firstName,
          link: `${baseUrl}/reset-password/${token}`,
        },
      );
      const subject = 'Password reset request';
      const from = 'Mirza <support-mirza@heymirza.com>';
      const to = user.email;

      await this.mailService.sendEmail(from, to, subject, html, request.id);

      this.logger.log(
        'Response status 204',
        `${AuthenticationController.name}#forgotPassword`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AuthenticationController.name}#forgotPassword`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @HttpCode(204)
  @Patch('application/resetPassword/:token')
  async resetPassword(
    @Req() request,
    @Param('token') token: string,
    @Body('password') newPassword: string,
  ) {
    try {
      const response = await this.authService.resetPasswordByToken(
        token,
        newPassword,
        request.id,
      );

      this.logger.log(
        'Response status 204',
        `${AuthenticationController.name}#setPassword`,
        request.id,
        response,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AuthenticationController.name}#setPassword`,
        request.id,
        error,
      );

      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Patch('application/changePassword')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() request: Request,
    @Body() adminChangePasswordDto: ChangePasswordDto,
  ) {
    try {
      await this.authService.changePassword(
        request.user.id,
        adminChangePasswordDto.existingPassword,
        adminChangePasswordDto.newPassword,
        request.id,
      );
      this.logger.log(
        'Response status 204',
        `${AuthenticationController.name}#changePassword`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AuthenticationController.name}#changePassword`,
        request.id,
        error,
      );

      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Patch('admin/changePassword')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async adminChangePassword(
    @Req() request: Request,
    @Body() adminChangePasswordDto: ChangePasswordDto,
  ) {
    try {
      await this.authService.adminChangePassword(
        request.user.id,
        adminChangePasswordDto.existingPassword,
        adminChangePasswordDto.newPassword,
        request.id,
      );
      this.logger.log(
        'Response status 204',
        `${AuthenticationController.name}#changePassword`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AuthenticationController.name}#changePassword`,
        request.id,
        error,
      );

      throw error;
    }
  }

  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Patch('admin/forgotPassword')
  @HttpCode(204)
  async adminForgotPassword(
    @Req() request: Request,
    @Body() adminForgotPasswordDto: AdminForgotPasswordDto,
  ) {
    try {
      await this.authService.adminForgotPassword(
        adminForgotPasswordDto,
        request.id,
      );

      this.logger.log(
        'Response status 204',
        `${AuthenticationController.name}#adminForgotPassword`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AuthenticationController.name}#adminForgotPassword`,
        request.id,
        error,
      );

      throw error;
    }
  }
}
