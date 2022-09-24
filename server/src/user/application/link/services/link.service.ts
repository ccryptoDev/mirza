import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ApplicationLink } from '../entities/link.entity';
import { CreateLinkDto } from '../validation/createLink.dto';
import { Merchant } from '../../../../admin/merchant/entities/merchant.entity';
import { LoggerService } from '../../../../logger/services/logger.service';
import { SendGridService } from '../../../../email/services/sendgrid.service';
import { TwilioService } from '../../../../sms/services/twilio.service';
import { NunjucksService } from '../../../../html-parser/services/nunjucks.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicationLinkService {
  constructor(
    @InjectRepository(ApplicationLink)
    private readonly applicationLinkRepository: Repository<ApplicationLink>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    private readonly sendGridService: SendGridService,
    private readonly twilioService: TwilioService,
    private readonly nunjucksService: NunjucksService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async createLinkRecord(
    createLinkDto: CreateLinkDto,
    merchant: string,
    requestId: string,
  ): Promise<{ applicationLinkUrl: string; id: string }> {
    const { firstName, email, phone, sendEmail, sendSms } = createLinkDto;
    this.logger.log(
      'Creating application link with arguments',
      `${ApplicationLink.name}#createLinkRecord`,
      requestId,
      createLinkDto,
    );

    const merchantRecord: Merchant = await this.merchantRepository.findOne({
      id: merchant,
    });
    if (!merchantRecord) {
      const errorMessage = `Merchant id ${merchantRecord.id} not found`;
      this.logger.error(
        errorMessage,
        `${ApplicationLink.name}#createLinkRecord`,
        requestId,
        createLinkDto,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    let applicationLink: ApplicationLink =
      this.applicationLinkRepository.create(createLinkDto);
    applicationLink = await this.applicationLinkRepository.save(
      applicationLink,
    );

    this.logger.log(
      'Application link created:',
      `${ApplicationLink.name}#createLinkRecord`,
      requestId,
      applicationLink,
    );

    const applicationLinkUrl = `${this.configService.get<string>('baseUrl')}/${
      merchantRecord.url
    }/apply/link/${applicationLink.id}`;

    if (sendEmail) {
      const html = await this.nunjucksService.htmlToString(
        'emails/application-link.html',
        {
          link: applicationLinkUrl,
          firstName,
        },
      );
      const from = this.configService.get<string>('sendersEmail');
      const subject = this.configService.get<string>('emailSubject');
      await this.sendGridService.sendEmail(
        from,
        email,
        subject,
        html,
        requestId,
      );
    }
    if (sendSms) {
      const smsMessage = this.configService.get<string>('smsTemplate');
      await this.twilioService.sendTextMessage(
        phone,
        `${smsMessage} ${applicationLinkUrl}`,
        requestId,
      );
    }

    this.logger.log(
      'Application link generated:',
      `${ApplicationLinkService.name}#createLinkRecord`,
      requestId,
      applicationLinkUrl,
    );

    return { applicationLinkUrl, id: applicationLink.id };
  }

  async getLinkRecord(id: string, requestId: string) {
    this.logger.log(
      'Getting application link with arguments',
      `${ApplicationLinkService.name}#getLinkRecord`,
      requestId,
      { id },
    );

    const applicationLink: ApplicationLink | null =
      await this.applicationLinkRepository.findOne({
        where: {
          id,
        },
        relations: ['merchant'],
      });
    if (!applicationLink) {
      const errorMessage = `Application link id ${applicationLink.id} not found`;
      this.logger.error(
        errorMessage,
        `${ApplicationLinkService.name}#getLinkRecord`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    this.logger.log(
      'Got application link:',
      `${ApplicationLinkService.name}#getLinkRecord`,
      requestId,
      applicationLink,
    );
    return applicationLink;
  }
}
