import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { CliqService } from '../services/cliq.service';
import { MakeCardPaymentDto } from '../validation/make-card-payment.dto';
import { TokenizeCardDto } from '../validation/tokenize-card-dto';

@Controller('/api/cliq')
export class CliqController {
  constructor(private readonly cliqService: CliqService) {}

  @Post('/cards/tokenize')
  async tokenizeCard(
    @Body() tokenizeCardDto: TokenizeCardDto,
    @Req() request: Request,
  ) {
    try {
      const response = await this.cliqService.tokenizeCard(
        tokenizeCardDto,
        request.id,
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('/cards/payments/send')
  async makeCardPayment(
    @Body() makeCardPayment: MakeCardPaymentDto,
    @Req() request: Request,
  ) {
    try {
      const response = await this.cliqService.makeCardPayment(
        makeCardPayment,
        request.id,
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
}
