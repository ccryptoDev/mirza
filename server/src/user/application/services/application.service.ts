import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import moment from 'moment';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk';
import s3 from 'aws-sdk/clients/s3';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Not,
  In,
  getRepository,
  Brackets,
  WhereExpressionBuilder,
} from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { PaymentManagement } from '../../../loan/payments/payment-management/entities/payment-management.entity';
import { PaymentManagementService } from '../../../loan/payments/payment-management/services/payment-management.service';
import { LoggerService } from '../../../logger/services/logger.service';
import { ScreenTracking } from '../../screen-tracking/entities/screen-tracking.entity';
import { User } from '../../entities/user.entity';
import { Merchant } from '../../../admin/merchant/entities/merchant.entity';
import { UserConsent } from '../../consent/entities/consent.entity';
import { ESignature } from '../../esignature/entities/esignature.entity';
import { ConsentService } from '../../consent/services/consent.service';
import { S3Service } from '../../../file-storage/services/s3.service';
import { AppService } from '../../../app.service';
import { SendGridService } from '../../../email/services/sendgrid.service';
import { NunjucksService } from '../../../html-parser/services/nunjucks.service';
import { Role } from '../../../authentication/roles/role.enum';
import Offer from '../../../loan/offers/interfaces/Offer';
import { LoanSettings } from '../../../admin/merchant/entities/loan-settings.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ESignature)
    private readonly esignatureRepository: Repository<ESignature>,
    @InjectRepository(UserConsent)
    private readonly userConsentRepository: Repository<UserConsent>,
    @InjectRepository(PaymentManagement)
    private readonly paymentManagementRepository: Repository<PaymentManagement>,
    @InjectRepository(ScreenTracking)
    private readonly screenTrackingRepository: Repository<ScreenTracking>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    private readonly paymentManagementService: PaymentManagementService,
    private readonly userConsentService: ConsentService,
    private readonly s3Service: S3Service,
    private readonly appService: AppService,
    private readonly logger: LoggerService,
    private readonly mailService: SendGridService,
    private readonly nunjucksService: NunjucksService,
    private readonly configService: ConfigService,
  ) {}

  async createLoan(
    screenTrackingId: string,
    userId: string,
    requestId: string,
  ) {
    this.logger.log(
      'Creating loan with arguments',
      `${ApplicationService.name}#createLoan`,
      requestId,
      { screenTrackingId, userId },
    );
    const user: User = await this.userRepository.findOne({
      id: userId,
    });
    if (!user) {
      const errorMessage = `User id ${user.id} not found`;
      this.logger.error(
        errorMessage,
        `${ApplicationService.name}#createLoan`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne({
        where: {
          id: screenTrackingId,
          isCompleted: false,
          user: userId,
        },
        relations: ['user', 'merchant'],
        order: {
          createdAt: 'DESC',
        },
      });

    if (!screenTracking) {
      const errorMessage = `Screen tracking not found or application is already complete`;
      this.logger.error(
        errorMessage,
        `${ApplicationService.name}#createLoan`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTracking.selectedOffer) {
      const errorMessage = 'No offers found for this screen tracking';
      this.logger.error(
        errorMessage,
        `${ApplicationService.name}#createLoan`,
        requestId,
      );
      throw new BadRequestException(undefined, errorMessage);
    }
    const existingLoan: PaymentManagement =
      await this.paymentManagementRepository.findOne({
        where: {
          screenTracking: screenTracking.id,
          status: Not(In(['expired', 'approved', 'pending'])),
        },
      });
    if (existingLoan) {
      const errorMessage = 'User already has an existing loan';
      this.logger.error(
        errorMessage,
        `${ApplicationService.name}#createLoan`,
        requestId,
      );
      throw new BadRequestException(undefined, errorMessage);
    }

    const paymentDetails: PaymentManagement =
      await this.paymentManagementService.createLoanPaymentSchedule(
        screenTracking,
        requestId,
      );
    if (!paymentDetails) {
      const errorMessage = 'Error while creating loan payment schedule';
      this.logger.error(
        errorMessage,
        `${ApplicationService.name}#createLoan`,
        requestId,
      );
      throw new InternalServerErrorException(undefined, errorMessage);
    }

    const lastLevel = 'repayment';
    await this.screenTrackingRepository.update(screenTracking.id, {
      lastLevel,
    });
    const updatedUserScreenTracking =
      await this.screenTrackingRepository.findOne(screenTracking.id);

    if (!(updatedUserScreenTracking.lastLevel === 'repayment')) {
      const errorMessage = 'Error while creating loan payment schedule';
      this.logger.error(
        errorMessage,
        `${ApplicationService.name}#createLoan`,
        requestId,
      );
      throw new InternalServerErrorException(undefined, errorMessage);
    }

    await this.userRepository.update(
      { id: userId },
      {
        isExistingLoan: true,
      },
    );

    // TODO replace email template
    // this.welcomeEmail(user, screenTracking, paymentDetails);
  }

  async welcomeEmail(
    user: User,
    screenTracking: ScreenTracking,
    payment: PaymentManagement,
  ) {
    try {
      const baseUrl = this.configService.get<string>('baseUrl');
      const html = await this.nunjucksService.htmlToString(
        'emails/application-welcome.html',
        {
          userName: `${user.firstName} ${user.lastName}`,
          dateCreated: moment(user.createdAt).format('MM/DD/YYYY'),
          financingTerm: screenTracking.selectedOffer.term,
          minAmt: `$${screenTracking.selectedOffer.monthlyPayment}`,
          link: `${baseUrl}/login`,
        },
      );
      const subject = 'Welcome Email';
      const from = 'Mirza <support-mirza@heymirza.com>';
      const to = user.email;

      await this.mailService.sendEmail(from, to, subject, html, '');

      this.logger.log(
        'Response status 204',
        `${ApplicationService.name}#updateCustomerDetails`,
        '',
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${ApplicationService.name}#updateCustomerDetails`,
        '',
        error,
      );
      throw error;
    }
  }

  async generateRIC(
    screenTrackingId: string,
    userId: string,
    request: Request,
  ) {
    const ip: string = this.appService.getIPAddress(request);
    this.logger.log(
      'Generating RIC with arguments',
      `${ApplicationService.name}#generateRIC`,
      request.id,
      { screenTrackingId, userId, ip },
    );
    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne({
        where: {
          id: screenTrackingId,
          user: userId,
        },
        relations: ['user', 'merchant'],
      });
    if (!screenTracking) {
      const errorMessage = `Screen tracking id ${screenTracking.id} not found`;
      this.logger.error(
        '',
        `${ApplicationService.name}#generateRIC`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const paymentManagement: PaymentManagement =
      await this.paymentManagementRepository.findOne({
        screenTracking: screenTrackingId,
        user: userId,
      });
    if (!paymentManagement) {
      const errorMessage = `Payment management id ${paymentManagement.id} not found`;
      this.logger.error(
        errorMessage,
        `${ApplicationService.name}#generateRIC`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const ricData = await this.getPromissoryNoteData(
      screenTracking.id,
      request,
    );
    const signature: ESignature | null =
      await this.esignatureRepository.findOne({
        user: userId,
      });
    if (!signature) {
      const errorMessage = `Esignature not found for user id ${userId}`;
      this.logger.error(
        errorMessage,
        `${ApplicationService.name}#uploadRICPdf`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const parsedRicData = {
      date: ricData.date,
      provider: {
        ...ricData.provider,
        lateFee: `$${this.appService.currencyToString(
          ricData.provider.lateFee,
        )}`,
      },
      ricSignaturePath: ricData.ricSignaturePath,
      screenTracking: ricData.screenTracking,
      selectedOffer: {
        ...ricData.selectedOffer,
        contractAmount: `$${this.appService.currencyToString(
          ricData.selectedOffer.contractAmount,
        )}`,
      },
      userData: {
        ...ricData.userData,
      },
      ip,
    };
    const signatureImage: PromiseResult<s3.GetObjectOutput, AWSError> =
      await this.s3Service.downloadFile(signature.signaturePath, request.id);
    const documentPath: string = await this.userConsentService.uploadRICPdf(
      {
        ...parsedRicData,
        signature: `data:image/png;base64,${signatureImage.Body.toString(
          'base64',
        )}`,
      },
      request,
    );

    let RICConsent: UserConsent = this.userConsentRepository.create({
      documentPath,
      documentName: 'Retail Installment Contract',
      documentVersion: 1,
      ip,
      signedAt: new Date(),
      screenTracking,
      paymentManagement: paymentManagement.id,
    });
    RICConsent = await this.userConsentRepository.save(RICConsent);

    /** update e-signature with screen tracking id **/
    await this.esignatureRepository.update(
      {
        screenTracking,
      },
      {
        consent: RICConsent.id,
      },
    );
  }

  async getPromissoryNoteData(screenTrackingId: string, request: Request) {
    this.logger.log(
      'Getting promissory note data 2 with arguments',
      `${ApplicationService.name}#getPromissoryNoteData`,
      request.id,
      { screenTrackingId },
    );
    const screenTracking: ScreenTracking | null =
      await this.screenTrackingRepository.findOne({
        where: { id: screenTrackingId },
        relations: ['user', 'merchant'],
      });

    if (!screenTracking) {
      const errorMessage = `Screen tracking id ${screenTracking.id} not found`;
      this.logger.error(
        errorMessage,
        `${ApplicationService.name}#getPromissoryNoteData`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTracking.user) {
      const errorMessage = 'User for this screen tracking not found';
      this.logger.error(
        errorMessage,
        `${ApplicationService.name}#getPromissoryNoteData`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const user: User = screenTracking.user as User;
    const merchant: Merchant = await this.merchantRepository.findOne({
      where: {
        id: (screenTracking.merchant as Merchant).id,
      },
      relations: ['loanSettings'],
    });

    const selectedOffer: Offer = screenTracking.selectedOffer;
    if (!selectedOffer) {
      const errorMessage = 'No offer selected';
      this.logger.error(
        errorMessage,
        `${ApplicationService.name}#getPromissoryNoteData`,
        request.id,
      );
      throw new ForbiddenException(undefined, errorMessage);
    }

    const ricSignature: ESignature = await this.esignatureRepository.findOne({
      user: user.id,
    });
    if (ricSignature) {
      ricSignature.signaturePath = this.s3Service.getS3Url(
        ricSignature.signaturePath,
      );
    }

    const response = {
      screenTracking: {
        applicationReference: screenTracking.applicationReference,
      },
      provider: {
        name: merchant.name,
        streetAddress: merchant.address,
        city: merchant.city,
        stateCode: merchant.stateCode,
        zipCode: merchant.zip,
        phone: merchant.phone,
        lateFee: merchant.loanSettings
          ? (merchant.loanSettings as LoanSettings).lateFee
          : 0,
      },
      selectedOffer: {
        ...selectedOffer,
        documentaryStampTax: 0,
        firstPaymentDate: moment().add(30, 'days').format('MM/DD/YYYY'),
        fundingDate: moment().format('MM/DD/YYYY'),
        paymentFrequency: 'monthly',
        salesTax: 0,
      },
      ricSignaturePath: ricSignature?.signaturePath,
      userData: {
        userReference: user.userReference,
        fullName: `${user.firstName} ${user.lastName}`,
        street: user.street,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
      },
      date: moment().format('MM/DD/YYYY'),
    };

    return response;
  }

  async connectUserConsentsToPM(
    screenTrackingId: string,
    userId: string,
    requestId: string,
  ) {
    this.logger.log(
      'Connecting user consents to PM with arguments',
      `${ApplicationService.name}#connectUserConsentsToPM`,
      requestId,
      { screenTrackingId, userId },
    );

    const screenTracking = await this.screenTrackingRepository.findOne({
      where: {
        id: screenTrackingId,
      },
      relations: ['user', 'merchant'],
    });

    if (!screenTracking) {
      const errorMessage = `Screen tracking id ${screenTracking.id} not found`;
      this.logger.error(
        '',
        `${ApplicationService.name}#connectUserConsentsToPM`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const paymentManagement: PaymentManagement | null =
      await this.paymentManagementRepository.findOne({
        screenTracking: screenTrackingId,
        user: userId,
      });
    if (!paymentManagement) {
      const errorMessage = `Payment management id ${paymentManagement.id} not found`;
      this.logger.error(
        errorMessage,
        `${ApplicationService.name}#connectUserConsentsToPM`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const userConsents: UserConsent[] = await this.userConsentRepository.find({
      where: {
        paymentManagement: null,
        screenTracking: screenTrackingId,
      },
    });

    if (userConsents.length) {
      await this.userConsentRepository.update(
        {
          screenTracking: screenTrackingId,
          paymentManagement: null,
        },
        { paymentManagement: paymentManagement.id },
      );
    }
  }

  async getApplicationByStatus(
    role: string,
    merchant: string,
    status: PaymentManagement['status'],
    page: number,
    perPage: number,
    search: string,
    requestId: string,
  ) {
    this.logger.log(
      'Getting complete applications with arguments',
      `${ApplicationService.name}#getApplicationByStatus`,
      requestId,
      status,
    );

    const applicationsResponse: [PaymentManagement[], number] =
      await getRepository(PaymentManagement)
        .createQueryBuilder('paymentManagement')
        .leftJoinAndSelect('paymentManagement.user', 'user')
        .leftJoinAndSelect('paymentManagement.screenTracking', 'screenTracking')
        .leftJoinAndSelect('paymentManagement.merchant', 'merchant')
        .where(
          new Brackets((whereExpressionBuilder: WhereExpressionBuilder) => {
            if (typeof status === 'string') {
              whereExpressionBuilder.where(
                'paymentManagement.status = :status',
                { status },
              );
            } else {
              // status is an array
              whereExpressionBuilder.where(
                'paymentManagement.status IN (:...statuses)',
                { statuses: status },
              );
            }

            if (role === Role.Merchant) {
              whereExpressionBuilder.andWhere(
                new Brackets(
                  (andWhereExpressionBuilder: WhereExpressionBuilder) => {
                    andWhereExpressionBuilder.where(
                      'paymentManagement.merchant = :merchant',
                      { merchant },
                    );
                  },
                ),
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
                      .orWhere(
                        `screenTracking.lastLevel ::text ILIKE '%${search}%'`,
                      )
                      .orWhere(`merchant.name ILIKE '%${search}%'`);

                    if (search.match(/^[0-9\.]{2,}$/)) {
                      andWhereExpressionBuilder.orWhere(
                        'screenTracking.approvedUpTo = :approvedUpTo',
                        { approvedUpTo: +search.replace(/[^0-9]/i, '') },
                      );
                    }
                  },
                ),
              );
            }
          }),
        )
        .take(perPage)
        .skip((page - 1) * perPage)
        .orderBy('paymentManagement.createdAt', 'DESC')
        .getManyAndCount();

    const applications = applicationsResponse[0].map(
      (paymentManagement: PaymentManagement) => {
        const screenTracking =
          paymentManagement.screenTracking as ScreenTracking;
        const user = paymentManagement.user as User;

        return {
          id: user.id,
          screenTrackingId: screenTracking.id,
          pmId: paymentManagement.id,
          userReference: user.userReference,
          name: `${user.firstName} ${user.lastName}`,
          phone: user.phones[0].phone,
          email: user.email,
          merchantName: (paymentManagement.merchant as Merchant).name,
          interestRate: paymentManagement.interestApplied,
          dateCreated: paymentManagement.createdAt,
          contractAmount: screenTracking?.selectedOffer?.contractAmount,
          term: screenTracking?.selectedOffer?.term,
          progress: screenTracking.lastLevel,
          status: paymentManagement.status,
        };
      },
    );

    const response = { items: applications, total: applicationsResponse[1] };
    this.logger.log(
      'Applications by status response:',
      `${ApplicationService.name}#getApplicationByStatus`,
      requestId,
      applicationsResponse,
    );

    return response;
  }

  async getApplicationInfo(screenTrackingId: string, requestId: string) {
    this.logger.log(
      'Getting application info with arguments',
      `${ApplicationService.name}#getApplicationInfo`,
      requestId,
      screenTrackingId,
    );

    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne({
        where: {
          id: screenTrackingId,
        },
        relations: ['user'],
      });
    if (!screenTracking) {
      const errorMessage = `Could not find screen tracking id ${screenTrackingId}`;
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTracking.user) {
      const errorMessage = `Could not find user for screen tracking id ${screenTrackingId}`;
      throw new NotFoundException(undefined, errorMessage);
    }

    const user: User = screenTracking.user as User;
    const paymentManagement: PaymentManagement =
      await this.paymentManagementRepository.findOne({
        user: user.id,
      });

    let ricSignature: string | undefined;
    const esignature: ESignature | null =
      await this.esignatureRepository.findOne({
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

    const applicationInfo = {
      city: user.city,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      financingReferenceNumber: screenTracking.applicationReference,
      financingStatus: paymentManagement.status,
      lastProfileUpdatedAt: (user as any).updatedAt,
      name: `${user.firstName} ${user.lastName}`,
      phoneNumber: user.phones[0].phone,
      phoneType: user.phones[0].type,
      selectedOffer: screenTracking.selectedOffer,
      ricSignature: ricSignature,
      registeredAt: (user as any).createdAt,
      ssnNumber: user.ssnNumber,
      state: user.state,
      street: user.street,
      unitApt: user.unitApt,
      userId: user.id,
      userReference: user.userReference,
      zipCode: user.zipCode,
    };

    this.logger.log(
      'Returning application info: ',
      `${ApplicationService.name}#getApplicationInfo`,
      requestId,
      applicationInfo,
    );

    return applicationInfo;
  }
}
