import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  getRepository,
  Repository,
  UpdateResult,
  WhereExpressionBuilder,
} from 'typeorm';
import moment from 'moment';

import { LoggerService } from '../../logger/services/logger.service';
import { ApplyDto } from '../application/validation/apply.dto';
import { User } from '../entities/user.entity';
import { Roles } from '../../authentication/roles/entities/roles.entity';
import { ActivityService } from '../activity/services/activity.service';
import { CountersService } from '../../counter/services/counters.service';
import { Counters } from '../../counter/entities/counters.entity';
import { ScreenTracking } from '../screen-tracking/entities/screen-tracking.entity';
import { PaymentManagement } from '../../loan/payments/payment-management/entities/payment-management.entity';
import { Merchant } from '../../admin/merchant/entities/merchant.entity';
import crypto from 'crypto';
import { ESignature } from '../esignature/entities/esignature.entity';
import { S3Service } from '../../file-storage/services/s3.service';
import { UpdatePasswordAndPhonesDto } from '../validation/update-user-data.dto';
import { UserConsent } from '../consent/entities/consent.entity';
import { LedgerService } from '../../loan/ledger/services/ledger.service';
import { LoanpaymentproService } from '../../loan/payments/loanpaymentpro/services/loanpaymentpro.service';
import GetAllUsersDto from '../validation/get-all-users.dto';
import { AdminJwtPayload } from '../../authentication/types/jwt-payload.types';
import { Role } from '../../authentication/roles/role.enum';
import { AppService } from '../../app.service';
import { ILedger } from '../../loan/ledger/interfaces/ledger.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(ScreenTracking)
    private readonly screenTrackingRepository: Repository<ScreenTracking>,
    @InjectRepository(PaymentManagement)
    private readonly paymentManagementRepository: Repository<PaymentManagement>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    @InjectRepository(ESignature)
    private readonly esignatureRepository: Repository<ESignature>,
    @InjectRepository(UserConsent)
    private readonly userConsentRepository: Repository<UserConsent>,
    private readonly s3Service: S3Service,
    private readonly countersService: CountersService,
    private readonly userActivityService: ActivityService,
    private readonly ledgerService: LedgerService,
    private readonly loanPaymentProService: LoanpaymentproService,
    private readonly logger: LoggerService,
    private readonly appService: AppService,
  ) {}

  async createNewUser(user: ApplyDto, requestId: string) {
    this.logger.log(
      'Creating new user with arguments',
      `${UserService.name}.createNewUser`,
      requestId,
      user,
    );

    const minDateOfBirth: Date = moment()
      .subtract(100, 'years')
      .startOf('day')
      .toDate();
    const maxDateOfBirth: Date = moment()
      .subtract(18, 'years')
      .startOf('day')
      .toDate();
    if (
      moment(user.dateOfBirth).startOf('day').isBefore(minDateOfBirth) ||
      moment(user.dateOfBirth).startOf('day').isAfter(maxDateOfBirth)
    ) {
      const errorMessage = `Min date of birth is ${minDateOfBirth} and max date of birth is ${maxDateOfBirth}`;
      this.logger.error(
        errorMessage,
        `${UserService.name}#createNewUser`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const existingUser: User = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      const errorMessage = 'User already registered';
      this.logger.error(
        errorMessage,
        `${UserService.name}#createNewUser`,
        requestId,
      );
      throw new BadRequestException(undefined, errorMessage);
    }

    if (!user.merchant) {
      const merchant: Merchant = await this.merchantRepository.findOne({
        name: 'Mirza',
      });
      if (!merchant) {
        const errorMessage = `Merchant id ${merchant.id} not found`;
        this.logger.error(
          errorMessage,
          `${UserService.name}#createNewUser`,
          requestId,
        );
        throw new NotFoundException(undefined, errorMessage);
      }

      user.merchant = merchant.id;
    } else {
      const merchant = await this.merchantRepository.findOne({
        id: user.merchant,
        isDeleted: false,
      });
      if (!merchant) {
        const errorMessage = `Merchant id ${merchant.id} not found`;
        this.logger.error(
          errorMessage,
          `${UserService.name}#createNewUser`,
          requestId,
        );
        throw new NotFoundException(undefined, errorMessage);
      }
    }

    const isValidStateCode: boolean = this.appService.isValidStateCode(
      user.state,
      requestId,
    );
    if (!isValidStateCode) {
      const errorMessage = `Invalid state code`;
      this.logger.error(
        errorMessage,
        `${UserService.name}#createNewUser`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const userRole: Roles = await this.rolesRepository.findOne({
      roleName: 'User',
    });
    if (!userRole) {
      const errorMessage = 'Internal Server Error';
      this.logger.error(
        `User's role not found`,
        `${UserService.name}#createNewUser`,
        requestId,
      );
      throw new InternalServerErrorException(undefined, errorMessage);
    }
    const userReferenceData: Counters =
      await this.countersService.getNextSequenceValue('user', requestId);
    const userReference = `USR_${userReferenceData.sequenceValue}`;
    const encryptedPassword = await this.encryptPassword(user.password);
    let newUser: User = this.userRepository.create({
      city: user.city,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phones: user.phones,
      merchant: user.merchant,
      ssnNumber: user.ssnNumber,
      state: user.state,
      street: user.street,
      unitApt: user.unitApt,
      zipCode: user.zipCode,
      userReference: userReference,
      password: encryptedPassword,
      role: userRole,
    });
    newUser = await this.userRepository.save(newUser);

    const userRequest = {
      userId: newUser.id,
      logData: `User registration successful - ${newUser.email}`,
    };
    const userSubject = 'Registration Success';
    const userDescription = 'User registration.';

    this.userActivityService.createUserActivity(
      userRequest,
      userSubject,
      userDescription,
      requestId,
    );

    return newUser;
  }

  async encryptPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  generateRandomPassword(length = 16): string {
    return crypto.randomBytes(length).toString('hex');
  }

  async getInfo(userId: string, requestId: string) {
    this.logger.log(
      'Get user info:',
      `${UserService.name}#getInfo`,
      requestId,
      userId,
    );
    const user = await this.userRepository.findOne(
      { id: userId },
      { relations: ['screenTracking'] },
    );
    const userInfo = {
      userReference: user.userReference,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user?.[0]?.[0]?.phone,
      dateOfBirth: user.dateOfBirth,
      street: user.street,
      zipCode: user.zipCode,
      state: user.state,
      ssnNumber: user.ssnNumber,
      registeredDate: (user as any).createdAt,
      lastProfileUpdateTime: (user as any).updatedAt,
    };

    return userInfo;
  }

  async getApplicationInformation(screenTrackingId: string, requestId: string) {
    this.logger.log(
      'Getting application information with arguments',
      `${UserService.name}#getApplicationInformation`,
      requestId,
      { screenTrackingId },
    );
    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne(
        { id: screenTrackingId },
        { relations: ['user'] },
      );

    if (!screenTracking) {
      const errorMessage = `ScreenTracking id ${screenTracking.id} not found`;
      this.logger.error(
        errorMessage,
        `${UserService.name}#getApplicationInformation`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const user: User = screenTracking.user as User;
    let ricSignature: string;
    const esignature: ESignature = await this.esignatureRepository.findOne({
      user,
    });
    if (esignature) {
      const signature = await this.s3Service.downloadFile(
        esignature.signaturePath,
        requestId,
      );
      ricSignature = `data:${
        signature.ContentType
      };base64,${signature.Body.toString('base64')}`;
    }
    const paymentManagement: PaymentManagement =
      await this.paymentManagementRepository.findOne({
        screenTracking,
      });

    const response = {
      address: user.street,
      applicationReference: screenTracking.applicationReference,
      city: user.city,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      firstName: user.firstName,
      isCompleted: screenTracking.isCompleted,
      lastName: user.lastName,
      lastStep: screenTracking.lastLevel,
      ...(paymentManagement && {
        nextPaymentSchedule: paymentManagement.nextPaymentSchedule,
      }),
      phones: user.phones,
      referenceNumber: user.userReference,
      ricSignature,
      screenTrackingId: screenTracking.id,
      selectedOffer: screenTracking.selectedOffer,
      ssn: user.ssnNumber,
      state: user.state,
      street: user.street,
      userId: user.id,
      unitApt: user.unitApt,
      zip: user.zipCode,
    };
    this.logger.log(
      'Got application information:',
      `${UserService.name}#getApplicationInformation`,
      requestId,
      response,
    );

    return response;
  }

  async getUserByPMId(pmId: string): Promise<User> {
    const paymentManagementDocument: PaymentManagement | null =
      await this.paymentManagementRepository.findOne({ id: pmId });
    const user = await this.userRepository.findOne({
      where: {
        id: paymentManagementDocument.user,
      },
    });
    return user;
  }

  async updatePasswordAndPhones(
    userId: string,
    updatePasswordAnPhonesDto: UpdatePasswordAndPhonesDto,
    requestId: string,
  ): Promise<void> {
    const { password, phones } = updatePasswordAnPhonesDto;
    this.logger.log(
      'Updating user password and phones with arguments',
      `${UserService.name}#updatePasswordAndPhones`,
      requestId,
      { ...updatePasswordAnPhonesDto, userId },
    );
    const user: User = await this.userRepository.findOne({ id: userId });
    if (!user) {
      const errorMessage = `User id ${userId} not found`;
      this.logger.error(
        errorMessage,
        `${UserService.name}#updatePasswordAndPhones`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const encryptedPassword: string = await this.encryptPassword(password);
    const result: UpdateResult = await this.userRepository.update(
      {
        id: userId,
      },
      { password: encryptedPassword, phones },
    );
    if (result.affected <= 0) {
      this.logger.log(
        'No data updated',
        `${UserService.name}#updatePasswordAndPhones`,
        requestId,
      );
    } else {
      this.logger.log(
        'User data updated successfully',
        `${UserService.name}#updatePasswordAndPhones`,
        requestId,
      );
    }
  }

  async getDashboard(userId: string, requestId: string) {
    this.logger.log(
      'Getting user dashboard with arguments',
      `${UserService.name}#getDashboard`,
      requestId,
      { userId },
    );

    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne({
        where: {
          user: userId,
        },
        relations: ['user'],
      });
    if (!screenTracking) {
      const errorMessage = `ScreenTracking for user id ${userId} not found`;
      this.logger.error(
        errorMessage,
        `${UserService.name}#getDashboard`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTracking.user) {
      const errorMessage = `User id ${userId} not found`;
      this.logger.error(
        errorMessage,
        `${UserService.name}#getDashboard`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const user: User = screenTracking.user as User;
    const { firstName, lastName, street, unitApt, city, state, zipCode } = user;
    const name = `${firstName} ${lastName}`;
    const address = `${street} ${unitApt} ${city} ${state} ${zipCode}`;

    const paymentManagement: PaymentManagement | null =
      await this.paymentManagementRepository.findOne({
        where: {
          user: userId,
        },
        relations: ['screenTracking'],
      });
    if (!paymentManagement) {
      const errorMessage = `Payment management id ${paymentManagement.id} not found`;
      this.logger.error(
        errorMessage,
        `${UserService.name}#getDashboard`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const ledger: ILedger = this.ledgerService.getPaymentLedger(
      paymentManagement,
      moment().startOf('day').toDate(),
      requestId,
    );
    paymentManagement.payOffAmount = ledger.payoff;

    const userConsents: UserConsent[] = await this.userConsentRepository.find({
      screenTracking,
    });
    if (!userConsents || userConsents.length <= 0) {
      const errorMessage = `User consents not found`;
      this.logger.error(
        errorMessage,
        `${UserService.name}#getDashboard`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    let smsPolicyPath = '';
    let esignaturePath = '';
    let ricPath = '';
    let creditPullPath = '';
    const eftaConsents = [];
    userConsents.forEach((consent) => {
      if (
        consent.documentPath &&
        consent.documentName === 'Text and Call Policy'
      ) {
        smsPolicyPath = consent.documentPath;
      } else if (
        consent.documentPath &&
        consent.documentName === 'E-Signature'
      ) {
        esignaturePath = consent.documentPath;
      } else if (
        consent.documentPath &&
        consent.documentName === 'Credit Pull Authorization'
      ) {
        creditPullPath = consent.documentPath;
      } else if (
        consent.documentPath &&
        consent.documentName === 'Retail Installment Contract'
      ) {
        ricPath = consent.documentPath;
      } else if (
        consent.documentPath &&
        consent.documentName === 'ACH Authorization'
      ) {
        eftaConsents.push(consent);
      }
    });

    const response = {
      name,
      address,
      phone: user.phones[0],
      email: user.email,
      smsPolicyPath,
      esignaturePath,
      creditPullPath,
      ricPath,
      eftaConsents,
      paymentManagementData: paymentManagement,
    };
    this.logger.log(
      'Got user dashboard:',
      `${UserService.name}#getDashboard`,
      requestId,
      response,
    );

    return response;
  }

  async getAllUsers(
    admin: AdminJwtPayload,
    getAllUsersDto: GetAllUsersDto,
    requestId: string,
  ) {
    this.logger.log(
      'Getting all users with arguments',
      `${UserService.name}#getAllUsers`,
      requestId,
      { admin, getAllUsersDto },
    );
    const { page, perPage, search } = getAllUsersDto;
    const { role, merchant } = admin;

    const screenTrackingsResponse: [ScreenTracking[], number] =
      await getRepository(ScreenTracking)
        .createQueryBuilder('screenTracking')
        .leftJoinAndSelect('screenTracking.user', 'user')
        .leftJoinAndSelect('screenTracking.merchant', 'merchant')
        .where(
          new Brackets((whereExpressionBuilder: WhereExpressionBuilder) => {
            if (role === Role.Merchant) {
              whereExpressionBuilder.where(
                'screenTracking.merchant = :merchant',
                { merchant },
              );
            }

            if (search) {
              whereExpressionBuilder.andWhere(
                new Brackets(
                  (andWhereExpressionBuilder: WhereExpressionBuilder) => {
                    andWhereExpressionBuilder
                      .where(`user.firstName ILIKE '%${search}%'`)
                      .orWhere(`user.lastName ILIKE '%${search}%'`)
                      .orWhere(`user.userReference ILIKE '%${search}%'`)
                      .orWhere(`user.email ILIKE '%${search}%'`)
                      .orWhere(
                        `user.phones #>> '{0, phone}' ILIKE '%${search}%'`,
                      )
                      .orWhere(`merchant.name ILIKE '%${search}%'`);
                  },
                ),
              );
            }
            if (search && search.toLowerCase() === 'completed') {
              whereExpressionBuilder.where(
                'screenTracking.isCompleted = :completed',
                { completed: true },
              );
            } else if (search && search.toLowerCase() === 'incomplete') {
              whereExpressionBuilder.where(
                'screenTracking.isCompleted = :completed',
                { completed: false },
              );
            }
          }),
        )
        .take(perPage)
        .skip((page - 1) * perPage)
        .orderBy('user.createdAt', 'DESC')
        .getManyAndCount();

    const users = screenTrackingsResponse[0].map((screenTracking: any) => {
      return {
        id: screenTracking.id,
        userReference: screenTracking.user?.userReference,
        name: `${screenTracking.user?.firstName} ${screenTracking.user?.lastName}`,
        email: screenTracking.user?.email,
        phone: screenTracking.user?.phones[0]?.phone,
        registerStatus: screenTracking?.isCompleted
          ? 'Completed'
          : 'Incomplete',
        merchantName: screenTracking.merchant?.name,
        createdDate: moment(screenTracking.user.createdAt).format(
          'MM/DD/YYYY hh:mm a',
        ),
      };
    });
    const response = { items: users, total: screenTrackingsResponse[1] };
    this.logger.log(
      'All users response:',
      `${UserService.name}#getAllUsers`,
      requestId,
      response,
    );

    return response;
  }
}
