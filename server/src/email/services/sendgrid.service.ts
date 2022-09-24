import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sendGridMail from '@sendgrid/mail';

import { LoggerService } from '../../logger/services/logger.service';

@Injectable()
export class SendGridService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async sendEmail(
    from: string,
    to: string,
    subject: string,
    html: string,
    requestId: string,
  ) {
    this.logger.log(
      'Sending email with arguments ',
      `${SendGridService.name}#sendEmail`,
      requestId,
      { from, to, subject, html },
    );
    sendGridMail.setApiKey(this.configService.get<string>('sendGridAPIKey'));
    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    try {
      await sendGridMail.send(mailOptions);
      this.logger.log(
        'Email sent.',
        `${SendGridService.name}#sendEmail`,
        requestId,
        mailOptions,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${SendGridService.name}#sendEmail`,
        requestId,
        error,
      );
    }
  }
}
