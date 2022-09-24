import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import moment from 'moment';
import fs from 'fs';
import { promisify } from 'util';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ScreenTracking } from '../../screen-tracking/entities/screen-tracking.entity';
import { User } from '../../entities/user.entity';
import { UserConsent } from '../entities/consent.entity';
import { LoggerService } from '../../../logger/services/logger.service';
import { S3Service } from '../../../file-storage/services/s3.service';
import { PuppeteerService } from '../../../pdf/services/puppeteer.service';
import { PaymentManagement } from '../../../loan/payments/payment-management/entities/payment-management.entity';
import { NunjucksService } from '../../../html-parser/services/nunjucks.service';
import { AppService } from '../../../app.service';
import { CreateConsentsDto } from '../../../user/application/validation/create-consents.dto';
import { Merchant } from '../../../admin/merchant/entities/merchant.entity';
import { Cards } from '../../cards/entities/cards.entity';
import { Accounts } from '../../accounts/entities/accounts.entity';
import { LoanSettings } from '../../../admin/merchant/entities/loan-settings.entity';
import { ESignature } from '../../esignature/entities/esignature.entity';
import { AdminJwtPayload } from '../../../authentication/types/jwt-payload.types';

@Injectable()
export class ConsentService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserConsent)
    private readonly userConsentRepository: Repository<UserConsent>,
    @InjectRepository(ScreenTracking)
    private readonly screenTrackingRepository: Repository<ScreenTracking>,
    @InjectRepository(PaymentManagement)
    private readonly paymentManagementRepository: Repository<PaymentManagement>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    @InjectRepository(Cards)
    private readonly userCardsRepository: Repository<Cards>,
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,
    @InjectRepository(ESignature)
    private readonly esignatureRepository: Repository<ESignature>,
    private readonly puppeteerService: PuppeteerService,
    private readonly nunjucksService: NunjucksService,
    private readonly s3Service: S3Service,
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {}

  async createApplicationConsents(
    screenTrackingId: string,
    createConsentsDto: CreateConsentsDto,
    request: Request,
  ) {
    this.logger.log(
      'Creating consents with arguments',
      `${ConsentService.name}#createConsents`,
      request.id,
      {
        screenTrackingId,
        createConsentsDto,
      },
    );

    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne({
        where: { id: screenTrackingId },
        relations: ['user'],
      });

    if (!screenTracking) {
      const errorMessage = `Screen tracking id ${screenTrackingId} not found`;
      this.logger.error(
        errorMessage,
        `${ConsentService.name}#createConsents`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTracking.user) {
      const errorMessage = `User for screen tracking id  ${screenTrackingId} not found`;
      this.logger.error(
        errorMessage,
        `${ConsentService.name}#createConsents`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const user: User = screenTracking.user as User;
    const { merchantId } = createConsentsDto;
    const merchant: Merchant = await this.merchantRepository.findOne({
      id: merchantId,
    });
    if (!merchant) {
      const errorMessage = `Merchant id ${screenTrackingId} not found`;
      this.logger.error(
        errorMessage,
        `${ConsentService.name}#createConsents`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const ip: string = this.appService.getIPAddress(request);
    const signedAt: Date = new Date();
    const fairCreditReportingAct: UserConsent =
      this.userConsentRepository.create({
        documentName: 'Fair Credit Reporting Act',
        ip,
        documentVersion: 1,
        screenTracking,
        signedAt,
      });
    const textAndCallPolicy: UserConsent = this.userConsentRepository.create({
      documentName: 'Text and Call Policy',
      ip,
      documentVersion: 1,
      screenTracking,
      signedAt,
    });
    const eSignature: UserConsent = this.userConsentRepository.create({
      documentName: 'E-Signature',
      ip,
      documentVersion: 1,
      screenTracking,
      signedAt,
    });
    const creditPullAuthorization: UserConsent =
      this.userConsentRepository.create({
        documentName: 'Credit Pull Authorization',
        ip,
        documentVersion: 1,
        screenTracking,
        signedAt,
      });

    const [
      fairCreditReportingActResponse,
      textAndCallPolicyResponse,
      eSignatureResponse,
      creditPullAuthorizationResponse,
    ] = await Promise.all([
      this.userConsentRepository.save(fairCreditReportingAct),
      this.userConsentRepository.save(textAndCallPolicy),
      this.userConsentRepository.save(eSignature),
      this.userConsentRepository.save(creditPullAuthorization),
    ]);

    const parsedMerchant = {
      ...merchant,
      address: this.appService.capitalize(merchant.address),
      city: this.appService.capitalize(merchant.city),
      name: this.appService.capitalize(merchant.name),
      phone: this.appService.formatPhoneNumber(merchant.phone),
    };
    const parsedUser = {
      name: this.appService.capitalize(`${user.firstName} ${user.lastName}`),
      street: this.appService.capitalize(user.street),
      city: this.appService.capitalize(user.city),
      email: user.email,
      phoneNumber: this.appService.formatPhoneNumber(user.phones[0].phone),
      state: user.state,
      zipCode: user.zipCode,
    };
    const today: string = moment.utc().format('MM/DD/YYYY');
    setTimeout(async () => {
      await Promise.all([
        this.createApplicationConsentPdf(
          'agreements/fair-credit-reporting-act.html',
          fairCreditReportingActResponse,
          user.userReference,
          screenTracking.applicationReference,
          request.id,
          { ip, today },
        ),
        this.createApplicationConsentPdf(
          'agreements/text-and-call-policy.html',
          textAndCallPolicyResponse,
          user.userReference,
          screenTracking.applicationReference,
          request.id,
          { ip, today },
        ),
        this.createApplicationConsentPdf(
          'agreements/esignature.html',
          eSignatureResponse,
          user.userReference,
          screenTracking.applicationReference,
          request.id,
          { merchant: parsedMerchant, ip, today },
        ),
        this.createApplicationConsentPdf(
          'agreements/credit-pull-authorization.html',
          creditPullAuthorizationResponse,
          user.userReference,
          screenTracking.applicationReference,
          request.id,
          { user: parsedUser, ip, today },
        ),
      ]);
    });

    await this.screenTrackingRepository.update(
      { id: screenTracking.id },
      { lastLevel: 'offers' },
    );

    this.logger.log(
      `Created consents:`,
      `${ConsentService.name}#createConsents`,
      request.id,
      {
        fairCreditReportingActResponse,
        textAndCallPolicyResponse,
        eSignatureResponse,
      },
    );
  }

  async createApplicationConsentPdf(
    htmlFilePath: string,
    userConsent: UserConsent,
    userReference: string,
    applicationReference: string,
    requestId: string,
    consentContext?: Record<string, any>,
  ): Promise<void> {
    const html: string = await this.nunjucksService.htmlToString(
      htmlFilePath,
      consentContext,
    );

    const replacedFilename = userConsent.documentName.split(' ').join('_');
    const pdfFileName = `./${applicationReference}_${replacedFilename}_${Math.round(
      +new Date() / 1000,
    )}.pdf`;

    await this.puppeteerService.generatePDF(html, pdfFileName, requestId);
    await this.uploadTermsPdf(
      pdfFileName,
      userConsent,
      applicationReference,
      userReference,
      requestId,
    );
  }

  async uploadRICPdf(ricData: any, request: Request) {
    const { userData } = ricData;
    const fsUnlinkPromise = promisify(fs.unlink);
    const pdfFileLocalPath = `./${
      ricData.screenTracking.applicationReference
    }_ric_${Math.round(+new Date() / 1000)}.pdf`;
    const html = await this.nunjucksService.htmlToString(
      'agreements/ric.html',
      ricData,
    );
    await this.puppeteerService.generatePDF(html, pdfFileLocalPath, request.id);

    const fileName = this.getOriginalNameFromUrl(pdfFileLocalPath);
    const s3Folder = 'Agreements';
    const s3SubFolder = userData.userReference;
    const s3Path = `${s3Folder}/${s3SubFolder}/${fileName}`;
    const response: ManagedUpload.SendData = await this.s3Service.uploadFile(
      s3Path,
      fs.readFileSync(pdfFileLocalPath),
      'application/pdf',
      request.id,
    );

    await fsUnlinkPromise(pdfFileLocalPath);
    const s3DocumentsPath = this.s3Service.getS3Url(
      response.Location.split('/').slice(3).join('/'),
    );

    return s3DocumentsPath;
  }

  async uploadTermsPdf(
    pdfFileLocalPath: string,
    userConsentData: UserConsent,
    applicationReference: string,
    userReference: string,
    requestId: string,
  ): Promise<string> {
    this.logger.log(
      `Uploading user consent to S3 with arguments`,
      `${S3Service.name}#uploadTermsPdf`,
      requestId,
      {
        pdfFileLocalPath,
        userConsentData,
        applicationReference,
        userReference,
      },
    );
    const fsUnlinkPromise = promisify(fs.unlink);
    const fileName = this.getOriginalNameFromUrl(pdfFileLocalPath);
    const s3Folder = 'Agreements';
    const s3SubFolder = userReference;
    const s3Path = s3Folder + '/' + s3SubFolder + '/' + fileName;
    const response: ManagedUpload.SendData = await this.s3Service.uploadFile(
      s3Path,
      fs.readFileSync(pdfFileLocalPath),
      'application/pdf',
      requestId,
    );
    this.logger.log(
      'User consent uploaded to S3',
      `${S3Service.name}#uploadTermsPdf`,
      requestId,
    );
    await fsUnlinkPromise(pdfFileLocalPath);
    if (userConsentData) {
      userConsentData.documentPath = this.s3Service.getS3Url(s3Path);
      await this.userConsentRepository.save(userConsentData);
    }

    return response.Location;
  }

  async uploadPromissoryAgreementAsset(
    filePath: string,
    userConsentDocument: UserConsent,
    screenTrackingId: string,
    requestId: string,
  ) {
    const fileName = this.getOriginalNameFromUrl(filePath);
    const s3Folder = 'Agreements';
    const screenTracking = await this.screenTrackingRepository.findOne({
      where: { id: screenTrackingId },
      relations: ['user'],
    });

    if (!screenTracking) {
      const errorMessage = `Screen tracking id ${screenTracking} not found`;
      throw new NotFoundException(undefined, errorMessage);
    }

    const applicationReference = screenTracking.applicationReference;
    const userReference = (screenTracking.user as User).userReference;
    const s3Path =
      `${s3Folder}/${userReference}/${applicationReference}/${fileName}`.replace(
        /\s/g,
        '_',
      );
    const response: ManagedUpload.SendData = await this.s3Service.uploadFile(
      s3Path,
      fs.readFileSync(filePath),
      'application/pdf',
      requestId,
    );
    if (userConsentDocument) {
      userConsentDocument.screenTracking = screenTracking.id;
      userConsentDocument.documentPath = this.s3Service.getS3Url(s3Path);
      await this.userConsentRepository.save(userConsentDocument);
    }

    return response.Location;
  }

  async createEFTAAgreement(userId: string, request: Request) {
    let errorMessage = '';
    const user: User = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['screenTracking', 'merchant'],
    });

    if (!user) {
      errorMessage = `User id ${userId} not found`;
      this.logger.error(
        errorMessage,
        `${ConsentService.name}#createEFTAAgreement`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!user.screenTracking) {
      errorMessage = `Screen tracking for user id ${userId} not found`;
      this.logger.error(
        errorMessage,
        `${ConsentService.name}#createEFTAAgreement`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const esignature: ESignature = await this.esignatureRepository.findOne({
      user,
    });
    if (!esignature) {
      errorMessage = `ESignature for user id ${userId} not found`;
      this.logger.error(
        errorMessage,
        `${ConsentService.name}#createEFTAAgreement`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const signature = await this.s3Service.downloadFile(
      esignature.signaturePath,
      request.id,
    );
    const ricSignature = `data:${
      signature.ContentType
    };base64,${signature.Body.toString('base64')}`;
    const paymentManagement: PaymentManagement =
      await this.paymentManagementRepository.findOne({
        user: user.id,
      });
    if (!paymentManagement) {
      errorMessage = `Payment management for user id ${userId} not found`;
      this.logger.error(
        errorMessage,
        `${ConsentService.name}#createEFTAAgreement`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const merchant: Merchant = await this.merchantRepository.findOne({
      id: (user.merchant as Merchant).id,
    });
    if (!merchant) {
      errorMessage = `Merchant for user id ${userId} not found`;
      this.logger.error(
        errorMessage,
        `${ConsentService.name}#createEFTAAgreement`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const userCard: Cards = await this.userCardsRepository.findOne({
      user: user.id,
    });
    if (!userCard) {
      errorMessage = `Card for user id ${userId} not found`;
      this.logger.error(
        errorMessage,
        `${ConsentService.name}#createEFTAAgreement`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const userAccount: Accounts = await this.accountsRepository.findOne({
      user: user.id,
    });
    let parsedACHData: Record<string, any>;
    if (userAccount) {
      parsedACHData = {
        accountHolder: userAccount.accountHolder,
        accountNumber: userAccount.accountNumber,
        routingNumber: userAccount.routingNumber,
      };
    } else {
      parsedACHData = {
        accountHolder: 'N/A',
        accountNumber: 'N/A',
        routingNumber: 'N/A',
      };
    }

    const selectedOffer = (user.screenTracking as ScreenTracking).selectedOffer;
    const parsedUserData = {
      name: `${this.appService.capitalize(
        user.firstName,
      )} ${this.appService.capitalize(user.lastName)}`,
      address: this.appService.capitalize(user.street),
      city: this.appService.capitalize(user.city),
      state: user.state,
      zip: user.zipCode,
      email: user.email,
      phone: this.appService.formatPhoneNumber(user.phones[0].phone),
      nextPaymentSchedule: moment
        .utc(paymentManagement.nextPaymentSchedule)
        .format('MM/DD/YYYY'),
      selectedOffer: {
        monthlyPayment: this.appService.currencyToString(
          selectedOffer.monthlyPayment,
        ),
        term: selectedOffer.term,
        downPayment: selectedOffer.downPayment ? true : false,
        downPaymentDollarAmount: this.appService.currencyToString(
          selectedOffer.downPayment,
        ),
      },
      ricSignature,
    };
    const parsedMerchantData = {
      name: this.appService.capitalize(merchant.name),
      NSFFee: (merchant.loanSettings as LoanSettings)
        ? this.appService.currencyToString(
            (merchant.loanSettings as LoanSettings).NSFFee,
          )
        : '0.00',
    };
    const parsedCardData = {
      cardholderName: `${this.appService.capitalize(
        userCard.billingFirstName,
      )} ${this.appService.capitalize(userCard.billingLastName)}`,
      cardNumber: userCard.cardNumberLastFourDigits,
      expirationDate: `${userCard.expirationMonth}/${userCard.expirationYear}`,
      cvv: userCard.cvv,
    };

    const ip = this.appService.getIPAddress(request);
    const today = moment().startOf('day').format('MM/DD/YYYY');
    const context = {
      userData: parsedUserData,
      merchantData: parsedMerchantData,
      ACHData: parsedACHData,
      cardData: parsedCardData,
      ip,
      today,
    };
    const screenTracking = user.screenTracking as ScreenTracking;
    const fsUnlinkPromise = promisify(fs.unlink);
    const pdfFileLocalPath = `./${
      screenTracking.applicationReference
    }_ach_authorization_${Math.round(+new Date() / 1000)}.pdf`;
    const html = await this.nunjucksService.htmlToString(
      'agreements/efta.html',
      context,
    );
    await this.puppeteerService.generatePDF(html, pdfFileLocalPath, request.id);
    const fileName = this.getOriginalNameFromUrl(pdfFileLocalPath);
    const s3Folder = 'Agreements';
    const s3SubFolder = `${user.userReference}/${screenTracking.applicationReference}`;
    const s3Path = `${s3Folder}/${s3SubFolder}/${fileName}`;
    const response: ManagedUpload.SendData = await this.s3Service.uploadFile(
      s3Path,
      fs.readFileSync(pdfFileLocalPath),
      'application/pdf',
      request.id,
    );
    await fsUnlinkPromise(pdfFileLocalPath);
    const s3DocumentsPath = this.s3Service.getS3Url(
      response.Location.split('/').slice(3).join('/'),
    );

    let EFTADocument: UserConsent = this.userConsentRepository.create({
      documentPath: s3DocumentsPath,
      documentName: 'ACH Authorization',
      documentVersion: 1,
      ip,
      signedAt: new Date(),
      screenTracking: screenTracking.id,
      paymentManagement: paymentManagement.id,
    });
    EFTADocument = await this.userConsentRepository.save(EFTADocument);

    return EFTADocument.id;
  }

  async getUserConsents(
    screenTrackingId: string,
    admin: AdminJwtPayload,
    requestId: string,
  ) {
    this.logger.log(
      'Getting user consents with arguments',
      `${ConsentService.name}#getUserConsents`,
      requestId,
      { screenTrackingId, admin },
    );

    const screenTrackingDocument: ScreenTracking | null =
      await this.screenTrackingRepository.findOne({
        where: {
          id: screenTrackingId,
        },
        relations: ['user'],
      });

    if (!screenTrackingDocument) {
      const errorMessage = `Could not find screen tracking id ${screenTrackingId}`;
      this.logger.error(
        errorMessage,
        `${ConsentService.name}#getUserConsents`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTrackingDocument.user) {
      const errorMessage = `Could not find the user screen tracking id ${screenTrackingId}`;
      this.logger.error(
        errorMessage,
        `${ConsentService.name}#getUserConsents`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const userConsents: UserConsent[] | null =
      await this.userConsentRepository.find({
        screenTracking: screenTrackingDocument.id,
      });

    if (!userConsents || userConsents.length <= 0) {
      const errorMessage = `No consents found for screen tracking id ${screenTrackingDocument.id}`;
      this.logger.error(
        errorMessage,
        `${ConsentService.name}#getUserDocuments`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    this.logger.log(
      'Got user consents:',
      `${ConsentService.name}#getUserDocuments`,
      requestId,
      userConsents,
    );

    return userConsents;
  }

  getOriginalNameFromUrl(url: string): string {
    const urlArray: string[] = url.split('/');

    return urlArray[urlArray.length - 1];
  }
}
