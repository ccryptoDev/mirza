import {
  Body,
  Controller,
  Get,
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
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { BadRequestResponse } from '../../../types/bad-request-response';
import { ErrorResponse } from '../../../types/error-response';
import { LoggerService } from '../../../logger/services/logger.service';
import {
  LogActivityService,
  logActivityModuleNames,
} from '../../../admin/log-activity/services/log-activity.service';
import { AddCardDto } from '../validation/add-card.dto';
import { CliqService } from '../../../payment-provider/services/cliq.service';
import { CardsService } from '../services/cards.service';
import ICliqCardTransactionResponse from '../../../payment-provider/interfaces/ICliqCardTransactionResponse';
import { JwtAuthGuard } from '../../../authentication/strategies/jwt-auth.guard';
import { GetUserCardsResponse } from '../types/get-user-cards-response';
import { Role } from '../../../authentication/roles/role.enum';
import { Roles } from '../../../authentication/roles/roles.decorator';
import { RolesGuard } from '../../../authentication/roles/guards/roles.guard';
import { AdminJwtPayload } from '../../../authentication/types/jwt-payload.types';
import { AddCardPipe } from '../validation/add-card.pipe';
import { SetDefaultPaymentMethodDto } from '../validation/set-default-payment-method.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api')
export class CardsController {
  constructor(
    private readonly logActivityService: LogActivityService,
    private readonly cardsService: CardsService,
    private readonly logger: LoggerService,
    private readonly cliqService: CliqService,
  ) {}

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Post('application/users/cards')
  async addCard(
    @Body(new AddCardPipe()) addCardDto: AddCardDto,
    @Req() request: Request,
  ) {
    try {
      const { screenTracking } = request.user;
      const cardTokenResponse: ICliqCardTransactionResponse =
        await this.cliqService.tokenizeCard(
          {
            address1: addCardDto.billingAddress,
            cardNumber: addCardDto.cardNumber,
            city: addCardDto.billingCity,
            cvv: addCardDto.cvv,
            expirationMonth: addCardDto.expirationMonth,
            expirationYear: addCardDto.expirationYear,
            firstName: addCardDto.billingFirstName,
            lastName: addCardDto.billingLastName,
            state: addCardDto.billingState,
            zip: addCardDto.billingZip,
          },
          request.id,
        );
      await this.cardsService.addCard(
        screenTracking,
        {
          ...addCardDto,
          customerVaultId: cardTokenResponse.customer_vault_id,
        },
        request.id,
      );

      this.logger.log(
        'Response status 201',
        `${CardsController.name}#addCard`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${CardsController.name}#addCard`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiOkResponse({ type: [GetUserCardsResponse] })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Get('application/users/cards')
  @UseGuards(JwtAuthGuard)
  async getUserCards(@Req() request: Request) {
    try {
      const { screenTracking } = request.user;
      const response = await this.cardsService.getUserCards(
        screenTracking,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${CardsController.name}#getUserCards`,
        request.id,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${CardsController.name}#getUserCards`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Post('admin/dashboard/users/cards/:screenTrackingId')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addCardByScreenTrackingId(
    @Param('screenTrackingId') screenTrackingId: string,
    @Body(new AddCardPipe()) addCardDto: AddCardDto,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      const cardTokenResponse: ICliqCardTransactionResponse =
        await this.cliqService.tokenizeCard(
          {
            address1: addCardDto.billingAddress,
            cardNumber: addCardDto.cardNumber,
            city: addCardDto.billingCity,
            cvv: addCardDto.cvv,
            expirationMonth: addCardDto.expirationMonth,
            expirationYear: addCardDto.expirationYear,
            firstName: addCardDto.billingFirstName,
            lastName: addCardDto.billingLastName,
            state: addCardDto.billingState,
            zip: addCardDto.billingZip,
          },
          request.id,
        );
      const response = await this.cardsService.addCard(
        screenTrackingId,
        {
          ...addCardDto,
          customerVaultId: cardTokenResponse.customer_vault_id,
        },
        request.id,
      );
      const { id, userName, email, role, merchant } = request.user;
      await this.logActivityService.createLogActivity(
        request,
        logActivityModuleNames.ACCOUNTS,
        `${request.user.email} - ${role} Added card id ${response.id}. Card last four digits ${response.cardNumberLastFourDigits}`,
        {
          id,
          email,
          role,
          userName,
          merchantId: merchant,
          screenTrackingId,
          userId: response.user,
          cardId: response.id,
        },
        undefined,
        undefined,
        screenTrackingId,
      );

      this.logger.log(
        'Response status 201:',
        `${CardsController.name}#addCardByScreenTrackingId`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${CardsController.name}#addCardByScreenTrackingId`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiOkResponse({ type: [GetUserCardsResponse] })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Get('admin/dashboard/users/cards/:screenTrackingId')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getCardsByScreenTrackingId(
    @Param('screenTrackingId') screenTrackingId: string,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      const response = await this.cardsService.getUserCards(
        screenTrackingId,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${CardsController.name}#getCardsByScreenTrackingId`,
        request.id,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${CardsController.name}#getCardsByScreenTrackingId`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Patch('application/users/cards')
  async setDefaultPaymentMethod(
    @Body()
    setDefaultPaymentMethod: SetDefaultPaymentMethodDto,
    @Req() request: Request,
  ) {
    const { screenTracking } = request.user;

    try {
      await this.cardsService.setDefaultPaymentMethod(
        screenTracking,
        setDefaultPaymentMethod,
        request.id,
      );

      this.logger.log(
        'Response status 204',
        `${CardsController.name}#setDefaultPaymentMethod`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${CardsController.name}#setDefaultPaymentMethod`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @HttpCode(204)
  @Patch('admin/dashboard/users/cards/:screenTrackingId')
  async setDefaultPaymentMethodByScreenTrackingId(
    @Param('screenTrackingId') screenTrackingId: string,
    @Body()
    setDefaultPaymentMethod: SetDefaultPaymentMethodDto,
    @Req() request: Request,
  ) {
    try {
      await this.cardsService.setDefaultPaymentMethod(
        screenTrackingId,
        setDefaultPaymentMethod,
        request.id,
      );

      this.logger.log(
        'Response status 204',
        `${CardsController.name}#setDefaultPaymentMethodByScreenTrackingId`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${CardsController.name}#setDefaultPaymentMethodByScreenTrackingId`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
