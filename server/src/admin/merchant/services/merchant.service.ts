import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  getRepository,
  Repository,
  WhereExpressionBuilder,
  getManager,
  EntityManager,
} from 'typeorm';
import { Request } from 'express';
import fs from 'fs';
import { promisify } from 'util';
import { ManagedUpload } from 'aws-sdk/clients/s3';

import { Merchant } from '../entities/merchant.entity';
import { LoggerService } from '../../../logger/services/logger.service';
import AddMerchantDto, {
  AccountsDto,
  CardsDto,
} from '../validation/add-merchant.dto';
import UpdateMerchantDto from '../validation/update-merchant.dto';
import { Terms } from '../entities/terms.entity';
import { ContractSettings } from '../entities/contract-settings.entity';
import { CreditReportSettings } from '../entities/credit-report-settings.entity';
import { AdminService } from '../../services/admin.service';
import { LoanSettings } from '../entities/loan-settings.entity';
import { Accounts } from '../entities/accounts.entity';
import { Cards } from '../entities/cards.entity';
import { SetPrimaryDisbursementMethodDto } from '../validation/set-primary-disbursement-method.dto';
import { AppService } from '../../../app.service';
import { MerchantOnboardingAddMerchantDto } from '../validation/merchant-onboarding-add-merchant.dto';
import { Consents } from '../entities/consents.entity';
import { NunjucksService } from '../../../html-parser/services/nunjucks.service';
import { PuppeteerService } from '../../../pdf/services/puppeteer.service';
import { S3Service } from '../../../file-storage/services/s3.service';
import moment from 'moment';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    @InjectRepository(Terms)
    private readonly merchantTermsRepository: Repository<Terms>,
    @InjectRepository(ContractSettings)
    private readonly merchantContractSettingsRepository: Repository<ContractSettings>,
    @InjectRepository(CreditReportSettings)
    private readonly merchantCreditReportSettingsRepository: Repository<CreditReportSettings>,
    @InjectRepository(LoanSettings)
    private readonly loanSettingsRepository: Repository<LoanSettings>,
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,
    @InjectRepository(Cards)
    private readonly cardsRepository: Repository<Cards>,
    @InjectRepository(Consents)
    private readonly consentsRepository: Repository<Consents>,
    private readonly nunjucksService: NunjucksService,
    private readonly puppeteerService: PuppeteerService,
    private readonly s3Service: S3Service,
    private readonly adminService: AdminService,
    private readonly logger: LoggerService,
    private readonly appService: AppService,
  ) {}

  async getMerchantByURL(url: string, requestId: string) {
    this.logger.log(
      'Getting merchant by url with params',
      `${MerchantService.name}#getMerchantByURL`,
      requestId,
    );
    const merchant: Merchant = await this.merchantRepository.findOne({
      where: {
        url,
      },
      relations: ['loanSettings'],
    });
    if (!merchant) {
      const errorMessage = `Could not find merchant for url ${url}`;
      this.logger.error(
        errorMessage,
        `${Merchant.name}#getMerchantByURL`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    this.logger.log(
      'Got merchant:',
      `${MerchantService.name}#getMerchantByURL`,
      requestId,
      merchant,
    );

    return merchant;
  }

  async isRegisteredMerchant(
    requestId: string,
    name?: string,
    email?: string,
  ): Promise<{ registered: boolean }> {
    this.logger.log(
      'Checking if merchant is already registered with params',
      `${MerchantService.name}#isRegisteredMerchant`,
      requestId,
    );
    const merchant: Merchant = await this.merchantRepository.findOne({
      where: {
        ...(name && { name: name.trim().toLocaleLowerCase() }),
        ...(email && { email: email.trim().toLocaleLowerCase() }),
      },
    });

    const response = {
      registered: merchant ? true : false,
    };
    this.logger.log(
      'Merchant exists response:',
      `${MerchantService.name}#isRegisteredMerchant`,
      requestId,
      response,
    );
    return response;
  }

  async getAllNames(requestId: string) {
    this.logger.log(
      'Getting all merchant names',
      `${MerchantService.name}#getAllNames`,
      requestId,
    );
    const MerchantNames: Merchant[] = await this.merchantRepository.find({
      select: ['name', 'id'],
      order: {
        name: 'ASC',
      },
    });
    if (!MerchantNames || MerchantNames.length <= 0) {
      throw new NotFoundException(undefined, 'merchant table is empty');
    }
    this.logger.log(
      'Got merchant names:',
      `${MerchantService.name}#getAllNames`,
      requestId,
      MerchantNames,
    );

    return MerchantNames;
  }

  async getAllMerchants(
    queryParams: { page: number; perPage: number; search: string },
    requestId: string,
  ) {
    this.logger.log(
      'Getting all merchants with arguments',
      `${MerchantService.name}#getAllMerchants`,
      requestId,
      { getAllMerchantsDto: queryParams },
    );
    const { page, perPage, search } = queryParams;

    const merchantsResponse: [Merchant[], number] = await getRepository(
      Merchant,
    )
      .createQueryBuilder('merchant')
      .where(
        new Brackets((whereExpressionBuilder: WhereExpressionBuilder) => {
          whereExpressionBuilder.where('merchant.isDeleted = :isDeleted', {
            isDeleted: false,
          });

          if (search) {
            whereExpressionBuilder.andWhere(
              new Brackets(
                (andWhereExpressionBuilder: WhereExpressionBuilder) => {
                  andWhereExpressionBuilder
                    .where(`merchant.region ILIKE '%${search}%'`)
                    .orWhere(`merchant.managementRegion ILIKE '%${search}%'`)
                    .orWhere(`merchant.businessCategory ILIKE '%${search}%'`)
                    .orWhere(`merchant.address ILIKE '%${search}%'`)
                    .orWhere(`merchant.city ILIKE '%${search}%'`)
                    .orWhere(`merchant.zip ILIKE '%${search}%'`)
                    .orWhere(`merchant.phone ILIKE '%${search}%'`)
                    .orWhere(`merchant.name ILIKE '%${search}%'`)
                    .orWhere(`merchant.url ILIKE '%${search}%'`)
                    .orWhere(`merchant.regionalManager ILIKE '%${search}%'`);
                },
              ),
            );
          }
        }),
      )
      .take(perPage)
      .skip((page - 1) * perPage)
      .orderBy('merchant.createdAt', 'DESC')
      .getManyAndCount();
    const response = {
      items: merchantsResponse[0],
      total: merchantsResponse[1],
    };

    this.logger.log(
      'Got merchants:',
      `${MerchantService.name}#getAllMerchants`,
      requestId,
      response,
    );

    return response;
  }

  async addMerchant(addMerchantDto: AddMerchantDto, request: Request) {
    this.logger.log(
      'Adding merchant with arguments ',
      `${Merchant.name}#addMerchant`,
      request.id,
      addMerchantDto,
    );

    const {
      information,
      terms,
      contractSettings,
      creditReportSettings,
      accounts,
      cards,
      loanSettings,
    } = addMerchantDto;

    const { email, name, stateCode } = information;
    const isValidState = await this.appService.isValidStateCode(
      stateCode,
      request.id,
    );
    if (!isValidState) {
      const errorMessage = 'Invalid state code';
      this.logger.error(
        errorMessage,
        `${Merchant.name}#addMerchant`,
        request.id,
      );
      throw new BadRequestException(undefined, errorMessage);
    }

    const existingMerchant = await this.merchantRepository.findOne({
      where: { email, name: name },
    });
    if (existingMerchant) {
      const errorMessage = 'Merchant already exists';
      this.logger.error(
        errorMessage,
        `${Merchant.name}#addMerchant`,
        request.id,
      );
      throw new BadRequestException(undefined, errorMessage);
    }

    let merchant: Merchant;
    await getManager().transaction(
      async (transactionEntityManager: EntityManager) => {
        const merchantCreditReportSettings: CreditReportSettings =
          this.merchantCreditReportSettingsRepository.create({
            ...creditReportSettings,
          });
        await transactionEntityManager.save(merchantCreditReportSettings);
        const merchantContractSettings: ContractSettings =
          this.merchantContractSettingsRepository.create({
            ...contractSettings,
          });
        await transactionEntityManager.save(merchantContractSettings);
        const merchantLoanSettings = this.loanSettingsRepository.create({
          ...loanSettings,
        });
        await transactionEntityManager.save(merchantLoanSettings);
        const merchantTerms: Terms = this.merchantTermsRepository.create({
          loanSettings: terms.loanSettings,
          downPaymentType: terms.downPaymentType,
        });
        await transactionEntityManager.save(merchantTerms);
        let newMerchant: Merchant = this.merchantRepository.create({
          ...information,
          url: information.name.replace(/\s/g, '-'),
          contractSettings: merchantContractSettings,
          creditReportSettings: merchantCreditReportSettings,
          loanSettings: merchantLoanSettings,
          terms: merchantTerms,
          applicationSource: 'admin dashboard',
        });
        newMerchant = await transactionEntityManager.save(newMerchant);
        merchant = newMerchant;

        // entities below require the merchant to be saved first because of the One-to-many relationship
        const newMerchantCard: Cards = this.cardsRepository.create({
          ...cards,
          merchant: newMerchant,
        });
        await transactionEntityManager.save(newMerchantCard);
        const newMerchantAccount: Accounts = this.accountsRepository.create({
          ...accounts,
          merchant: newMerchant,
        });
        await transactionEntityManager.save(newMerchantAccount);
      },
    );
    if (!merchant) {
      const errorMessage = 'Internal Server Error';
      this.logger.error(
        errorMessage,
        `${Merchant.name}#addMerchant`,
        request.id,
      );
      throw new InternalServerErrorException(undefined, errorMessage);
    }

    await this.createMerchantConsents(merchant, request);
    await this.adminService.createAdmin(
      {
        userName: information.name,
        email: information.email,
        phoneNumber: information.phone,
        role: 'Merchant',
        merchantId: merchant.id,
      },
      request.id,
    );

    const response = {
      merchantId: merchant.id,
    };
    this.logger.log(
      'Added merchant: ',
      `${Merchant.name}#addMerchant`,
      request.id,
      merchant,
    );

    return response;
  }

  async merchantOnboardingAddMerchant(
    addMerchantDto: MerchantOnboardingAddMerchantDto,
    request: Request,
  ) {
    this.logger.log(
      'Adding merchant with arguments ',
      `${Merchant.name}#merchantOnboardingAddMerchant`,
      request.id,
      addMerchantDto,
    );

    const { email, name, stateCode, phone } = addMerchantDto;
    const isValidState = this.appService.isValidStateCode(
      stateCode,
      request.id,
    );
    if (!isValidState) {
      const errorMessage = 'Invalid state code';
      this.logger.error(
        errorMessage,
        `${Merchant.name}#merchantOnboardingAddMerchant`,
        request.id,
      );
      throw new BadRequestException(undefined, errorMessage);
    }

    const existingMerchant = await this.merchantRepository.findOne({
      where: [{ email }, { name }],
    });
    if (existingMerchant) {
      const errorMessage = 'Merchant already exists';
      this.logger.error(
        errorMessage,
        `${Merchant.name}#merchantOnboardingAddMerchant`,
        request.id,
      );
      throw new BadRequestException(undefined, errorMessage);
    }

    const loanTerms: number[] = [4, 6, 8, 12, 24, 36, 48];
    const creditTiers: string[] = ['A', 'B', 'C', 'D'];
    const loanSettings = loanTerms.map((loanTerm: number) => {
      return {
        active: loanTerm === 4 || loanTerm === 12 ? true : false,
        loanTerm,
        tiers: creditTiers.map((creditTier) => {
          return {
            active:
              (loanTerm === 4 || loanTerm === 12) && creditTier === 'A'
                ? true
                : false,
            apr: 0,
            downPayment: 0,
            ficoMax: 850,
            ficoMin: 300,
            ...(loanTerm === 4 && { contractAmount: 500 }),
            ...(loanTerm === 12 && { contractAmount: 2000 }),
            ...(loanTerm !== 4 && loanTerm !== 12 && { contractAmount: 1500 }),
            merchantDiscountRate: 0,
            paymentDiscountRate: 10,
            minAnnualIncome: 0,
            name: creditTier,
          };
        }),
        activeStates: ['all'] as 'all'[],
      };
    });

    let merchant: Merchant;
    await getManager().transaction(
      async (transactionEntityManager: EntityManager) => {
        const merchantTerms: Terms = this.merchantTermsRepository.create({
          downPaymentType: 'dollarAmount',
          loanSettings,
        });
        await transactionEntityManager.save(merchantTerms);
        let newMerchant: Merchant = this.merchantRepository.create({
          ...addMerchantDto,
          url: name.replace(/\s/g, '-'),
          applicationSource: 'merchant onboarding',
          terms: merchantTerms,
        });
        newMerchant = await transactionEntityManager.save(newMerchant);
        merchant = newMerchant;
      },
    );

    if (!merchant) {
      const errorMessage = 'Internal Server Error';
      this.logger.error(
        errorMessage,
        `${Merchant.name}#merchantOnboardingAddMerchant`,
        request.id,
      );
      throw new InternalServerErrorException(undefined, errorMessage);
    }

    await this.createMerchantConsents(merchant, request);
    await this.adminService.createAdmin(
      {
        userName: name,
        email: email,
        phoneNumber: phone,
        role: 'Merchant',
        merchantId: merchant.id,
      },
      request.id,
    );

    const response = {
      merchantURL: merchant.url,
    };
    this.logger.log(
      'Added merchant: ',
      `${Merchant.name}#merchantOnboardingAddMerchant`,
      request.id,
      merchant,
    );

    return response;
  }

  async createMerchantConsents(merchant: Merchant, request: Request) {
    const ip: string = this.appService.getIPAddress(request);
    const signedAt: Date = new Date();
    const termsAndConditions: Consents = this.consentsRepository.create({
      documentName: 'Terms and Conditions',
      ip,
      documentVersion: 1,
      merchant,
      signedAt,
    });
    const consentToFees: Consents = this.consentsRepository.create({
      documentName: 'Consent to Fees',
      ip,
      documentVersion: 1,
      merchant,
      signedAt,
    });

    const [termsAndConditionsResponse, consentToFeesResponse] =
      await Promise.all([
        this.consentsRepository.save(termsAndConditions),
        this.consentsRepository.save(consentToFees),
      ]);

    const formattedMerchant = {
      name: this.appService.capitalize(merchant.name),
      contactName: this.appService.capitalize(merchant.contactName),
      address: this.appService.capitalize(merchant.address),
    };
    const today: string = moment.utc().format('MM/DD/YYYY');

    setTimeout(async () => {
      await Promise.all([
        this.createMerchantConsentsPDF(
          'agreements/merchant/terms-and-conditions.html',
          termsAndConditionsResponse,
          request.id,
          { merchant: formattedMerchant, ip, today },
        ),
        this.createMerchantConsentsPDF(
          'agreements/merchant/consent-to-fees.html',
          consentToFeesResponse,
          request.id,
          { merchant: formattedMerchant, ip, today },
        ),
      ]);
    });
  }

  async generateConsentsForDefaultMerchant(
    merchantId: string,
    request: Request,
  ): Promise<void> {
    const merchant: Merchant = await this.merchantRepository.findOne({
      id: merchantId,
    });
    if (!merchant) {
      const errorMessage = `Merchant id ${merchantId} not found`;
      this.logger.error(
        errorMessage,
        `${Merchant.name}#generateConsentsForDefaultMerchant`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    await this.createMerchantConsents(merchant, request);
  }

  async createMerchantConsentsPDF(
    htmlFilePath: string,
    merchantConsent: Consents,
    requestId: string,
    consentContext?: Record<string, any>,
  ) {
    const html: string = await this.nunjucksService.htmlToString(
      htmlFilePath,
      consentContext,
    );

    const replacedFilename = merchantConsent.documentName.split(' ').join('_');
    const pdfFileName = `./${replacedFilename}_${Math.round(
      +new Date() / 1000,
    )}.pdf`;

    await this.puppeteerService.generatePDF(html, pdfFileName, requestId);
    await this.uploadConsentsPDF(pdfFileName, merchantConsent, requestId);
  }

  async uploadConsentsPDF(
    pdfFileLocalPath: string,
    merchantConsent: Consents,
    requestId: string,
  ) {
    this.logger.log(
      `Uploading user consent to S3 with arguments`,
      `${MerchantService.name}#uploadConsentsPDF`,
      requestId,
      {
        pdfFileLocalPath,
        userConsentData: merchantConsent,
      },
    );
    const fsUnlinkPromise = promisify(fs.unlink);
    const fileName = this.getOriginalNameFromUrl(pdfFileLocalPath);
    const s3Path = `Agreements/Merchant/${merchantConsent.id}/${fileName}`;
    const response: ManagedUpload.SendData = await this.s3Service.uploadFile(
      s3Path,
      fs.readFileSync(pdfFileLocalPath),
      'application/pdf',
      requestId,
    );
    this.logger.log(
      'User consent uploaded to S3',
      `${MerchantService.name}#uploadConsentsPDF`,
      requestId,
    );
    await fsUnlinkPromise(pdfFileLocalPath);
    if (merchantConsent) {
      merchantConsent.documentPath = this.s3Service.getS3Url(s3Path);
      await this.consentsRepository.save(merchantConsent);
    }

    return response.Location;
  }

  getOriginalNameFromUrl(url: string): string {
    const urlArray: string[] = url.split('/');

    return urlArray[urlArray.length - 1];
  }

  async getConsents(id: string, requestId: string): Promise<Consents[]> {
    this.logger.log(
      'Getting merchant consents with arguments:',
      `${Merchant.name}#getConsents`,
      requestId,
      { id },
    );
    const consents: Consents[] = await this.consentsRepository.find({
      where: {
        merchant: id,
      },
    });
    if (!consents || consents.length <= 0) {
      const errorMessage = `Could not find merchant for id ${id}`;
      this.logger.error(
        errorMessage,
        `${Merchant.name}#getConsents`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    this.logger.log(
      'Got merchant consents:',
      `${Merchant.name}#getConsents`,
      requestId,
      consents,
    );

    return consents;
  }

  async getMerchantById(id: string, requestId: string) {
    this.logger.log(
      'Getting merchant with arguments',
      `${Merchant.name}#getMerchantById`,
      requestId,
      { id },
    );
    const merchant: Merchant | null = await this.merchantRepository.findOne({
      where: {
        id,
      },
      relations: ['contractSettings', 'creditReportSettings', 'loanSettings'],
    });
    if (!merchant) {
      const errorMessage = `Could not find merchant for id ${id}`;
      this.logger.error(
        errorMessage,
        `${Merchant.name}#getMerchantById`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    this.logger.log(
      'Got merchant:',
      `${Merchant.name}#getMerchantById`,
      requestId,
      merchant,
    );

    return merchant;
  }

  async updateMerchantById(
    id: string,
    updateMerchantDto: UpdateMerchantDto,
    requestId: string,
  ) {
    this.logger.log(
      'Updating merchant with arguments',
      `${Merchant.name}#updateMerchantById`,
      requestId,
      { id, updateMerchantDto: updateMerchantDto },
    );

    const {
      information,
      terms: merchantTerms,
      contractSettings,
      creditReportSettings,
      loanSettings,
    } = updateMerchantDto;

    const merchant: Merchant | null = await this.merchantRepository.findOne({
      where: { id },
      relations: [
        'contractSettings',
        'creditReportSettings',
        'loanSettings',
        'terms',
      ],
    });
    if (!merchant) {
      const errorMessage = `Could not find merchant id ${id}`;
      this.logger.error(
        errorMessage,
        `${Merchant.name}#updateMerchantById`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    if (information) {
      await this.merchantRepository.update({ id }, { ...information });
    }
    if (merchantTerms) {
      await this.merchantTermsRepository.update(
        { id: (merchant.terms as Terms).id },
        {
          loanSettings: merchantTerms.loanSettings,
          downPaymentType: merchantTerms.downPaymentType,
        },
      );
    }
    if (contractSettings) {
      if (!merchant.contractSettings) {
        await getManager().transaction(
          async (transactionEntityManager: EntityManager) => {
            const newContractSettings =
              this.merchantContractSettingsRepository.create({
                ...contractSettings,
              });
            await transactionEntityManager.save(newContractSettings);
            await transactionEntityManager.update(
              Merchant,
              { id: merchant.id },
              { contractSettings: newContractSettings },
            );
          },
        );
      } else {
        await this.merchantContractSettingsRepository.update(
          {
            id: (merchant.contractSettings as ContractSettings).id,
          },
          { ...contractSettings },
        );
      }
    }
    if (creditReportSettings) {
      if (!merchant.creditReportSettings) {
        await getManager().transaction(
          async (transactionEntityManager: EntityManager) => {
            const newCreditReportSettings =
              this.merchantCreditReportSettingsRepository.create({
                ...creditReportSettings,
              });
            await transactionEntityManager.save(newCreditReportSettings);
            await transactionEntityManager.update(
              Merchant,
              { id: merchant.id },
              { creditReportSettings: newCreditReportSettings },
            );
          },
        );
      } else {
        await this.merchantCreditReportSettingsRepository.update(
          {
            id: (merchant.creditReportSettings as CreditReportSettings).id,
          },
          { ...creditReportSettings },
        );
      }
    }

    if (loanSettings) {
      if (!merchant.loanSettings) {
        await getManager().transaction(
          async (transactionEntityManager: EntityManager) => {
            const newLoanSettings = this.loanSettingsRepository.create({
              ...loanSettings,
            });
            await transactionEntityManager.save(newLoanSettings);
            await transactionEntityManager.update(
              Merchant,
              { id: merchant.id },
              { loanSettings: newLoanSettings },
            );
          },
        );
      } else {
        await this.loanSettingsRepository.update(
          {
            id: (merchant.loanSettings as LoanSettings).id,
          },
          { ...loanSettings },
        );
      }
    }

    this.logger.log(
      'Updated merchant:',
      `${Merchant.name}#updateMerchantById`,
      requestId,
      merchant,
    );

    return merchant;
  }

  async getMerchantTerms(
    merchantId: string,
    requestId: string,
  ): Promise<Terms> {
    this.logger.log(
      'Getting merchant terms with arguments',
      `${Merchant.name}#getMerchantTerms`,
      requestId,
      { id: merchantId },
    );
    const merchant: Merchant = await this.merchantRepository.findOne({
      where: { id: merchantId },
      relations: ['terms'],
    });
    if (!merchant) {
      const errorMessage = `Merchant id ${merchantId} not found`;
      this.logger.error(
        errorMessage,
        `${Merchant.name}#getMerchantTerms`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!merchant.terms) {
      const errorMessage = `Merchant terms for merchant id ${merchantId} not found`;
      this.logger.error(
        errorMessage,
        `${Merchant.name}#getMerchantTerms`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const response: Terms = merchant.terms;
    this.logger.log(
      'Got merchant terms:',
      `${Merchant.name}#getMerchantTerms`,
      requestId,
      response,
    );

    return response;
  }

  async getContractSettings(id: string, requestId: string) {
    this.logger.log(
      'Getting merchant contract settings with arguments',
      `${Merchant.name}#getContractSettings`,
      requestId,
      { id },
    );
    const merchant: Merchant | null = await this.merchantRepository.findOne(
      {
        id,
      },
      { relations: ['contractSettings'] },
    );
    if (!merchant?.contractSettings) {
      const errorMessage = `Could not find merchant id ${id}`;
      this.logger.error(
        errorMessage,
        `${Merchant.name}#getContractSettings`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    this.logger.log(
      'Got merchant contract settings:',
      `${Merchant.name}#getContractSettings`,
      requestId,
      merchant.contractSettings,
    );

    return merchant.contractSettings as ContractSettings;
  }

  async getMerchantCreditReportSettings(id: string, requestId: string) {
    this.logger.log(
      'Getting merchant credit report settings with arguments',
      `${Merchant.name}#getMerchantCreditReportSettings`,
      requestId,
      { id },
    );
    const merchant: Merchant | null = await this.merchantRepository.findOne(
      {
        id,
      },
      { relations: ['creditReportSettings'] },
    );
    if (!merchant?.creditReportSettings) {
      const errorMessage = `Could not find merchant id ${id}`;
      this.logger.error(
        errorMessage,
        `${Merchant.name}#getMerchantCreditReportSettings`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    this.logger.log(
      'Got merchant credit report settings:',
      `${Merchant.name}#getMerchantCreditReportSettings`,
      requestId,
      merchant.creditReportSettings,
    );

    return merchant.creditReportSettings as CreditReportSettings;
  }

  async getLoanSettings(
    merchantId: string,
    requestId: string,
  ): Promise<LoanSettings> {
    this.logger.log(
      'Getting merchant loan settings with arguments',
      `${Merchant.name}#getLoanSettings`,
      requestId,
      { merchantId },
    );
    const merchant: Merchant = await this.merchantRepository.findOne({
      where: {
        id: merchantId,
      },
      relations: ['loanSettings'],
    });
    if (!merchant) {
      const errorMessage = `Could not find merchant id ${merchantId}`;
      this.logger.error(
        errorMessage,
        `${Merchant.name}#getLoanSettings`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!merchant.loanSettings) {
      const errorMessage = `Could not find loan settings for merchant id ${merchantId}`;
      this.logger.error(
        errorMessage,
        `${Merchant.name}#getLoanSettings`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const response: LoanSettings = merchant.loanSettings as LoanSettings;
    this.logger.log(
      'Got merchant loan settings:',
      `${Merchant.name}#getLoanSettings`,
      requestId,
      response,
    );

    return response;
  }

  async getCards(merchantId: string, requestId: string): Promise<Cards[]> {
    this.logger.log(
      'Getting merchant cards with arguments',
      `${Merchant.name}#getCards`,
      requestId,
      { merchantId },
    );
    const cards: Cards[] = await this.cardsRepository.find({
      where: {
        merchant: merchantId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!cards || cards.length <= 0) {
      const errorMessage = `Could not find any card for merchant id ${merchantId}`;
      this.logger.error(errorMessage, `${Merchant.name}#getCards`, requestId);
      throw new NotFoundException(undefined, errorMessage);
    }

    this.logger.log(
      'Got merchant cards:',
      `${Merchant.name}#getCards`,
      requestId,
      cards,
    );

    return cards;
  }

  async getAccounts(
    merchantId: string,
    requestId: string,
  ): Promise<Accounts[]> {
    this.logger.log(
      'Getting merchant accounts with arguments',
      `${Merchant.name}#getAccounts`,
      requestId,
      { merchantId },
    );
    const accounts: Accounts[] = await this.accountsRepository.find({
      where: {
        merchant: merchantId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!accounts || accounts.length <= 0) {
      const errorMessage = `Could not find any account for merchant id ${merchantId}`;
      this.logger.error(
        errorMessage,
        `${Merchant.name}#getAccounts`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    this.logger.log(
      'Got merchant accounts:',
      `${Merchant.name}#getAccounts`,
      requestId,
      accounts,
    );

    return accounts;
  }

  async addCard(merchantId: string, cardsDto: CardsDto, requestId: string) {
    this.logger.log(
      'Adding merchant cards with arguments',
      `${Merchant.name}#getCards`,
      requestId,
      { merchantId, cardsDto },
    );
    const merchant: Merchant = await this.merchantRepository.findOne({
      id: merchantId,
    });
    if (!merchant) {
      const errorMessage = `Could not find merchant id ${merchantId}`;
      this.logger.error(errorMessage, `${Merchant.name}#addCard`, requestId);
      throw new NotFoundException(undefined, errorMessage);
    }
    const { cardNumber, cardholderName, isPrimaryDisbursementMethod } =
      cardsDto;
    const existingCard = await this.cardsRepository.findOne({
      merchant: merchant,
      cardNumberLastFourDigits: cardNumber.substring(cardNumber.length - 4),
      cardholderName,
    });
    if (existingCard) {
      const errorMessage = `Card already added`;
      this.logger.error(errorMessage, `${Merchant.name}#addCard`, requestId);
      throw new BadRequestException(undefined, errorMessage);
    }

    let card: Cards = this.cardsRepository.create({ ...cardsDto, merchant });
    card = await this.cardsRepository.save(card);

    if (isPrimaryDisbursementMethod) {
      await this.setPrimaryDisbursementMethod(
        merchant.id,
        {
          cardId: card.id,
          accountId: undefined,
        },
        requestId,
      );
    }

    this.logger.log(
      'Added merchant card',
      `${Merchant.name}#addCard`,
      requestId,
      card,
    );
  }

  async addAccount(
    merchantId: string,
    accountsDto: AccountsDto,
    requestId: string,
  ) {
    this.logger.log(
      'Adding merchant account with arguments',
      `${Merchant.name}#addAccount`,
      requestId,
      { merchantId, accountsDto },
    );
    const merchant: Merchant = await this.merchantRepository.findOne({
      id: merchantId,
    });
    if (!merchant) {
      const errorMessage = `Could not find merchant id ${merchantId}`;
      this.logger.error(errorMessage, `${Merchant.name}#addAccount`, requestId);
      throw new NotFoundException(undefined, errorMessage);
    }
    const {
      accountHolder,
      accountNumber,
      routingNumber,
      bankName,
      isPrimaryDisbursementMethod,
    } = accountsDto;
    const existingAccount = await this.accountsRepository.findOne({
      merchant: merchant,
      accountHolder,
      accountNumber,
      bankName,
      routingNumber,
    });
    if (existingAccount) {
      const errorMessage = `Account already added`;
      this.logger.error(errorMessage, `${Merchant.name}#addAccount`, requestId);
      throw new BadRequestException(undefined, errorMessage);
    }

    let account: Accounts = this.accountsRepository.create({
      ...accountsDto,
      merchant,
    });
    account = await this.accountsRepository.save(account);

    if (isPrimaryDisbursementMethod) {
      await this.setPrimaryDisbursementMethod(
        merchant.id,
        {
          cardId: undefined,
          accountId: account.id,
        },
        requestId,
      );
    }

    this.logger.log(
      'Added merchant account',
      `${Merchant.name}#addAccount`,
      requestId,
      account,
    );
  }

  async setPrimaryDisbursementMethod(
    merchantId: string,
    setPrimaryDisbursementMethodDto: SetPrimaryDisbursementMethodDto,
    requestId: string,
  ): Promise<void> {
    this.logger.log(
      'Setting the primary disbursement method with arguments',
      `${Merchant.name}#setPrimaryDisbursementMethod`,
      requestId,
      { setPrimaryDisbursementMethodDto },
    );

    const { accountId, cardId } = setPrimaryDisbursementMethodDto;
    if (accountId) {
      const account: Accounts = await this.accountsRepository.findOne({
        merchant: merchantId,
        id: accountId,
      });
      if (!account) {
        const errorMessage = `Could not find account id ${accountId} for merchant id ${merchantId}`;
        this.logger.error(
          errorMessage,
          `${Merchant.name}#setPrimaryDisbursementMethod`,
          requestId,
        );
        throw new NotFoundException(undefined, errorMessage);
      }
      const cards: Cards[] = await this.cardsRepository.find({
        merchant: merchantId,
      });
      if (!cards || cards.length <= 0) {
        await this.accountsRepository.update(
          { merchant: merchantId },
          { isPrimaryDisbursementMethod: false },
        );
      } else {
        await Promise.all([
          this.accountsRepository.update(
            { merchant: merchantId },
            { isPrimaryDisbursementMethod: false },
          ),
          this.cardsRepository.update(
            { merchant: merchantId },
            { isPrimaryDisbursementMethod: false },
          ),
        ]);
      }
      await this.accountsRepository.update(
        { id: accountId },
        { isPrimaryDisbursementMethod: true },
      );
    } else if (cardId) {
      const card: Cards = await this.cardsRepository.findOne({
        merchant: merchantId,
        id: cardId,
      });
      if (!card) {
        const errorMessage = `Could not find card id ${cardId} for merchant id ${merchantId}`;
        this.logger.error(
          errorMessage,
          `${Merchant.name}#setPrimaryDisbursementMethod`,
          requestId,
        );
        throw new NotFoundException(undefined, errorMessage);
      }
      const accounts: Accounts[] = await this.accountsRepository.find({
        merchant: merchantId,
      });
      if (!accounts || accounts.length <= 0) {
        await this.cardsRepository.update(
          { merchant: merchantId },
          { isPrimaryDisbursementMethod: false },
        );
      } else {
        await Promise.all([
          this.cardsRepository.update(
            { merchant: merchantId },
            { isPrimaryDisbursementMethod: false },
          ),
          this.accountsRepository.update(
            { merchant: merchantId },
            { isPrimaryDisbursementMethod: false },
          ),
        ]);
      }
      await this.cardsRepository.update(
        { id: cardId },
        { isPrimaryDisbursementMethod: true },
      );
    }

    this.logger.log(
      'Set the primary disbursement method',
      `${Merchant.name}#setPrimaryDisbursementMethod`,
      requestId,
    );
  }
}
