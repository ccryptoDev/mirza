import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Role } from '../../../authentication/roles/role.enum';
import { Roles } from '../../../authentication/roles/roles.decorator';
import { RolesGuard } from '../../../authentication/roles/guards/roles.guard';
import { LoggerService } from '../../../logger/services/logger.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import QR from 'qr-image';

import { JwtAuthGuard } from '../../../authentication/strategies/jwt-auth.guard';
import { MerchantService } from '../services/merchant.service';
import AddMerchantDto, {
  AccountsDto,
  CardsDto,
} from '../validation/add-merchant.dto';
import UpdateMerchantDto from '../validation/update-merchant.dto';
import { AdminJwtPayload } from '../../../authentication/types/jwt-payload.types';
import {
  LogActivityService,
  logActivityModuleNames,
} from '../../log-activity/services/log-activity.service';
import { BadRequestResponse } from '../../../types/bad-request-response';
import { ErrorResponse } from '../../../types/error-response';
import { GetAllMerchantsResponse } from '../types/get-all-merchants-response';
import { Terms } from '../entities/terms.entity';
import { ContractSettings } from '../entities/contract-settings.entity';
import { CreditReportSettings } from '../entities/credit-report-settings.entity';
import { AddMerchantPipe } from '../validation/add-merchant.pipe';
import { Cards } from '../entities/cards.entity';
import { Accounts } from '../entities/accounts.entity';
import { AddCard } from '../validation/add-card.pipe';
import { SetPrimaryDisbursementMethodDto } from '../validation/set-primary-disbursement-method.dto';
import { AddAccount } from '../validation/add-account.pipe';
import { MerchantOnboardingAddMerchantDto } from '../validation/merchant-onboarding-add-merchant.dto';
import { MerchantOnboardingAddMerchantPipe } from '../validation/merchant-onboarding-add-merchant.pipe';
import appConfig from '../../../app.config';
import { Consents } from '../entities/consents.entity';

@ApiBearerAuth()
@Controller('/api/')
export class MerchantController {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly logActivityService: LogActivityService,
    private readonly logger: LoggerService,
  ) {}

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Get('admin/dashboard/merchants/url/:url')
  async getMerchantByURL(@Req() request: Request, @Param('url') url: string) {
    try {
      const response = await this.merchantService.getMerchantByURL(
        url,
        request.id,
      );
      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getMerchantByURL`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getMerchantByURL`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Get('merchants/registered')
  async isRegisteredMerchant(
    @Req() request: Request,
    @Query('name') name?: string,
    @Query('email') email?: string,
  ) {
    try {
      if (name || email) {
        const response: { registered: boolean } =
          await this.merchantService.isRegisteredMerchant(
            request.id,
            name,
            email,
          );
        this.logger.log(
          'Response status 200',
          `${MerchantController.name}#isRegisteredMerchant`,
          request.id,
        );

        return response;
      }
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#isRegisteredMerchant`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('admin/dashboard/merchants/names')
  async getNames(@Req() request: Request) {
    try {
      const response = await this.merchantService.getAllNames(request.id);
      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getNames`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getNames`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Merchant)
  @Get('admin/dashboard/merchants/cards')
  async getCards(@Req() request: Request & { user: AdminJwtPayload }) {
    const { merchant } = request.user;
    try {
      const cards: Cards[] = await this.merchantService.getCards(
        merchant,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getCards`,
        request.id,
      );
      return cards;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getCards`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('admin/dashboard/merchants/:id/cards')
  async getCardsByMerchantId(
    @Req() request: Request & { user: AdminJwtPayload },
    @Param('id') id: string,
  ) {
    try {
      const cards: Cards[] = await this.merchantService.getCards(
        id,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getCards`,
        request.id,
      );
      return cards;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getCards`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Merchant)
  @Get('admin/dashboard/merchants/consents')
  async getConsents(@Req() request: Request & { user: AdminJwtPayload }) {
    const { merchant } = request.user;
    try {
      const consents: Consents[] = await this.merchantService.getConsents(
        merchant,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getConsents`,
        request.id,
      );
      return consents;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getConsents`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('admin/dashboard/merchants/:id/consents')
  async getConsentsByMerchantId(
    @Req() request: Request & { user: AdminJwtPayload },
    @Param('id') id: string,
  ) {
    try {
      const consents: Consents[] = await this.merchantService.getConsents(
        id,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getConsentsByMerchantId`,
        request.id,
      );
      return consents;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getConsentsByMerchantId`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Merchant)
  @Get('admin/dashboard/merchants/accounts')
  async getAccounts(@Req() request: Request & { user: AdminJwtPayload }) {
    const { merchant } = request.user;
    try {
      const response: Accounts[] = await this.merchantService.getAccounts(
        merchant,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getAccounts`,
        request.id,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getAccounts`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('admin/dashboard/merchants/:id/accounts')
  async getAccountsByMerchantId(
    @Req() request: Request & { user: AdminJwtPayload },
    @Param('id') id: string,
  ) {
    try {
      const response: Accounts[] = await this.merchantService.getAccounts(
        id,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getAccountsByMerchantId`,
        request.id,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getAccountsByMerchantId`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Merchant)
  @HttpCode(204)
  @Post('admin/dashboard/merchants/cards')
  async addCard(
    @Body(new AddCard())
    cardsDto: CardsDto,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    const { merchant } = request.user;
    try {
      await this.merchantService.addCard(merchant, cardsDto, request.id);

      this.logger.log(
        'Response status 204',
        `${MerchantController.name}#addCard`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#addCard`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @HttpCode(204)
  @Post('admin/dashboard/merchants/:id/cards')
  async addCardByMerchantId(
    @Body(new AddCard())
    cardsDto: CardsDto,
    @Param('id') id: string,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      await this.merchantService.addCard(id, cardsDto, request.id);

      this.logger.log(
        'Response status 204',
        `${MerchantController.name}#addCardByMerchantId`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#addCardByMerchantId`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Merchant)
  @HttpCode(204)
  @Post('admin/dashboard/merchants/accounts')
  async addAccount(
    @Body(new AddAccount())
    accountsDto: AccountsDto,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    const { merchant } = request.user;
    try {
      await this.merchantService.addAccount(merchant, accountsDto, request.id);

      this.logger.log(
        'Response status 204',
        `${MerchantController.name}#addAccount`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#addAccount`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @HttpCode(204)
  @Post('admin/dashboard/merchants/:id/accounts')
  async addAccountByMerchantId(
    @Body(new AddAccount())
    accountsDto: AccountsDto,
    @Param('id') id: string,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      await this.merchantService.addAccount(id, accountsDto, request.id);

      this.logger.log(
        'Response status 204',
        `${MerchantController.name}#addAccountByMerchantId`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#addAccountByMerchantId`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Merchant)
  @HttpCode(204)
  @Patch('admin/dashboard/merchants/disbursement')
  async setPrimaryDisbursementMethod(
    @Body()
    setPrimaryDisbursementMethodDto: SetPrimaryDisbursementMethodDto,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    const { accountId, cardId } = setPrimaryDisbursementMethodDto;
    if (accountId || cardId) {
      const { merchant } = request.user;

      try {
        await this.merchantService.setPrimaryDisbursementMethod(
          merchant,
          setPrimaryDisbursementMethodDto,
          request.id,
        );

        this.logger.log(
          'Response status 204',
          `${MerchantController.name}#setPrimaryDisbursementMethod`,
          request.id,
        );
      } catch (error) {
        this.logger.error(
          'Error:',
          `${MerchantController.name}#setPrimaryDisbursementMethod`,
          request.id,
          error,
        );
        throw error;
      }
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @HttpCode(204)
  @Patch('admin/dashboard/merchants/:id/disbursement')
  async setPrimaryDisbursementMethodByMerchantId(
    @Body()
    setPrimaryDisbursementMethodDto: SetPrimaryDisbursementMethodDto,
    @Param('id') id: string,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    const { accountId, cardId } = setPrimaryDisbursementMethodDto;
    if (accountId || cardId) {
      try {
        await this.merchantService.setPrimaryDisbursementMethod(
          id,
          setPrimaryDisbursementMethodDto,
          request.id,
        );

        this.logger.log(
          'Response status 204',
          `${MerchantController.name}#setPrimaryDisbursementMethod`,
          request.id,
        );
      } catch (error) {
        this.logger.error(
          'Error:',
          `${MerchantController.name}#setPrimaryDisbursementMethod`,
          request.id,
          error,
        );
        throw error;
      }
    }
  }

  @ApiOkResponse({ type: GetAllMerchantsResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('admin/dashboard/merchants')
  async getAllMerchants(
    @Req() request: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(25), ParseIntPipe) perPage: number,
    @Query('search') search: string,
  ) {
    try {
      const response = await this.merchantService.getAllMerchants(
        { page, perPage, search },
        request.id,
      );
      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getAllMerchants`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getAllMerchants`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Post('admin/dashboard/merchants')
  async addMerchant(
    @Body(new AddMerchantPipe())
    addMerchantDto: AddMerchantDto,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      const response = await this.merchantService.addMerchant(
        addMerchantDto,
        request,
      );
      const { id, userName, email, role } = request.user;
      const { information } = addMerchantDto;

      await this.logActivityService.createLogActivity(
        request,
        logActivityModuleNames.MANAGE_MERCHANTS,
        `${request.user.email} - ${role} Added new merchant id ${response.merchantId}`,
        {
          id,
          email,
          role,
          userName,
          name: information.name,
          contactName: information.contactName,
          address: information.address,
          city: information.city,
          businessCategory: information.businessCategory,
          stateCode: information.stateCode,
          zipCode: information.zip,
          phone: information.phone,
        },
      );

      this.logger.log(
        'Response status 201',
        `${MerchantController.name}#addMerchant`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#addMerchant`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @Post('merchantOnboarding/merchants')
  async merchantOnboardingAddMerchant(
    @Body(new MerchantOnboardingAddMerchantPipe())
    addMerchantDto: MerchantOnboardingAddMerchantDto,
    @Req() request: Request,
  ) {
    try {
      const response = await this.merchantService.merchantOnboardingAddMerchant(
        addMerchantDto,
        request,
      );

      this.logger.log(
        'Response status 201',
        `${MerchantController.name}#merchantOnboardingAddMerchant`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#merchantOnboardingAddMerchant`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @Get('merchantOnboarding/QRImage/:url')
  async downloadQRCode(
    @Param('url') url: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const { baseUrl } = appConfig();
      const QRImageStream = QR.image(`${baseUrl}/${url}`, { type: 'png' });
      response.set({
        'Content-Type': 'image/png',
        'Content-disposition': 'attachment; filename=QR-code.png',
      });
      this.logger.log(
        'Response status 201',
        `${MerchantController.name}#downloadQRCode`,
        request.id,
      );

      QRImageStream.pipe(response);
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#downloadQRCode`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('admin/dashboard/merchants/:id/terms')
  async getMerchantTerms(@Param('id') id: string, @Req() request: Request) {
    try {
      const response: Terms = await this.merchantService.getMerchantTerms(
        id,
        request.id,
      );
      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getMerchantTerms`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getMerchantTerms`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('admin/dashboard/merchants/settings/contracts/:id')
  async getMerchantContractSettings(
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    try {
      const response: ContractSettings =
        await this.merchantService.getContractSettings(id, request.id);
      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getMerchantContractSettings`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getMerchantContractSettings`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Get('admin/dashboard/merchants/settings/creditReport/:id')
  async getMerchantCreditReportSettings(
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    try {
      const response: CreditReportSettings =
        await this.merchantService.getMerchantCreditReportSettings(
          id,
          request.id,
        );
      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getMerchantCreditReportSettings`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getMerchantCreditReportSettings`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Patch('admin/dashboard/merchants/:id')
  async updateMerchant(
    @Param('id') id: string,
    @Body() updateMerchantDto: UpdateMerchantDto,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      const response = await this.merchantService.updateMerchantById(
        id,
        updateMerchantDto,
        request.id,
      );
      const { id: AdminId, userName, email, role } = request.user;

      await this.logActivityService.createLogActivity(
        request,
        logActivityModuleNames.MANAGE_MERCHANTS,
        `${request.user.email} - ${role} Edited merchant id ${id}`,
        {
          id: AdminId,
          userName,
          email,
          ...updateMerchantDto,
        },
      );

      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#updateMerchant`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#updateMerchant`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/dashboard/merchants/:id/settings/loan')
  async getLoanSettings(
    @Param('id') id: string,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      const loanSettings = await this.merchantService.getLoanSettings(
        id,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getLoanSettings`,
        request.id,
      );
      return loanSettings;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getLoanSettings`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Merchant)
  @Get('admin/dashboard/merchants/:id')
  async getMerchant(@Param('id') id: string, @Req() request: Request) {
    try {
      const response = await this.merchantService.getMerchantById(
        id,
        request.id,
      );
      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#getMerchant`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#getMerchant`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  @Post('scripts/generateConsentsForDefaultMerchant')
  async generateConsentsForDefaultMerchant(
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      const { merchant } = request.user;
      const response =
        await this.merchantService.generateConsentsForDefaultMerchant(
          merchant,
          request,
        );
      this.logger.log(
        'Response status 200',
        `${MerchantController.name}#generateConsentsForDefaultMerchant`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${MerchantController.name}#generateConsentsForDefaultMerchant`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
