import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../authentication/strategies/jwt-auth.guard';
import { LoggerService } from '../../../logger/services/logger.service';
import { OffersService } from '../services/offers.service';
import { SelectOfferDto } from '../validation/selectOffer.dto';
import { BadRequestResponse } from '../../../types/bad-request-response';
import { ErrorResponse } from '../../../types/error-response';
import { Offer } from '../types/offers-response';

@Controller('/api/application')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly logger: LoggerService,
  ) {}

  @ApiOkResponse({ type: [Offer] })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes()
  @Get('offers')
  async getOffers(@Req() request: Request) {
    const { screenTracking } = request.user;

    try {
      const response: Offer[] = await this.offersService.getOffers(
        screenTracking,
        request.id,
      );
      this.logger.log(
        'Response status 200',
        `${OffersController.name}#getOffers`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${OffersController.name}#getOffers`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('offers/select')
  @HttpCode(204)
  async selectOffer(
    @Body() selectOfferDto: SelectOfferDto,
    @Req() request: Request,
  ) {
    const { screenTracking } = request.user;

    try {
      await this.offersService.selectOffer(
        screenTracking,
        selectOfferDto,
        request.id,
      );
      this.logger.log(
        'Response status 204',
        `${OffersController.name}#selectOffer`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${OffersController.name}#selectOffer`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
