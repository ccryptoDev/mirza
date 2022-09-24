import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenizeCardDto } from '../validation/tokenize-card-dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import url from 'url';

import { LoggerService } from '../../logger/services/logger.service';
import { MakeCardPaymentDto } from '../validation/make-card-payment.dto';
import ICliqCardTransactionResponse from '../interfaces/ICliqCardTransactionResponse';

@Injectable()
export class CliqService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async tokenizeCard(
    tokenizeCardDto: TokenizeCardDto,
    requestId: string,
  ): Promise<ICliqCardTransactionResponse> {
    this.logger.log(
      'Tokenizing card with arguments:',
      `${CliqService.name}#tokenizeCard`,
      requestId,
      tokenizeCardDto,
    );

    const {
      cardNumber,
      expirationMonth,
      expirationYear,
      cvv,
      address1,
      city,
      firstName,
      lastName,
      state,
      zip,
    } = tokenizeCardDto;
    const securityKey: string = this.configService.get<string>('securityKey');
    const requestBody = new url.URLSearchParams({
      customer_vault: 'add_customer',
      security_key: securityKey,
      ccnumber: cardNumber,
      ccexp: `${expirationMonth}/${expirationYear}`,
      cvv,
      address1,
      city,
      firstName,
      lastName,
      state,
      zip,
    });
    const { data } = await axios.post(
      'https://secure.cardflexonline.com/api/transact.php',
      requestBody.toString(),
    );

    const response: ICliqCardTransactionResponse = this.parseResponse(
      data as string,
    );
    if (response.response_code !== '100') {
      const errorMessage = response.responsetext;
      this.logger.error(
        errorMessage,
        `${CliqService.name}#tokenizeCard`,
        requestId,
      );
      throw new BadRequestException(undefined, errorMessage);
    }
    this.logger.log(
      'Tokenized card:',
      `${CliqService.name}#tokenizeCard`,
      requestId,
      response,
    );

    return response;
  }

  async makeCardPayment(
    makeCardPaymentDto: MakeCardPaymentDto,
    requestId: string,
  ) {
    this.logger.log(
      'Tokenizing card with arguments:',
      `${CliqService.name}#tokenizeCard`,
      requestId,
      makeCardPaymentDto,
    );

    const { customerVaultId, amount } = makeCardPaymentDto;
    const securityKey: string = this.configService.get<string>('securityKey');
    const requestBody = new url.URLSearchParams({
      customer_vault_id: customerVaultId,
      security_key: securityKey,
      amount: '' + amount,
    });
    const { data } = await axios.post(
      'https://secure.cardflexonline.com/api/transact.php',
      requestBody.toString(),
    );

    const response = this.parseResponse(data as string);
    this.logger.log(
      'Tokenized card:',
      `${CliqService.name}#tokenizeCard`,
      requestId,
      response,
    );

    return response;
  }

  parseResponse(response: string): ICliqCardTransactionResponse {
    // Response is in x-www-form-urlencoded format
    const searchParams: URLSearchParams = new url.URLSearchParams(response);
    const jsonResponse: Record<string, any> = {};
    searchParams.forEach((value, name) => {
      jsonResponse[name] = value;
    });

    return jsonResponse as ICliqCardTransactionResponse;
  }
}
