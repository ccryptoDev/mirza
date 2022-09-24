import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Twilio from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { LoggerService } from '../../logger/services/logger.service';

@Injectable()
export class TwilioService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async sendTextMessage(
    to: string,
    message: string,
    requestId: string,
  ): Promise<void> {
    const accountSid = this.configService.get<string>('accountId');
    const authToken = this.configService.get<string>('authToken');
    const from = this.configService.get<string>('merchantPhoneNumber');

    const client = Twilio(accountSid, authToken);
    const result: MessageInstance = await client.messages.create({
      body: message,
      from,
      to,
    });
    this.logger.log(
      'Text message sent',
      `${TwilioService.name}#sendTextMessage`,
      requestId,
      result,
    );
  }
}
