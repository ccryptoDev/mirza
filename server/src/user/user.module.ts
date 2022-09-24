import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { ScreenTrackingService } from './screen-tracking/services/screen-tracking.service';
import { ScreenTracking } from './screen-tracking/entities/screen-tracking.entity';
import { ActivityService } from './activity/services/activity.service';
import { UserActivity } from './activity/entities/activity.entity';
import { ConsentService } from './consent/services/consent.service';
import { ConsentController } from './consent/controllers/consent.controller';
import { UserDocumentsService } from './documents/services/documents.service';
import { OffersController } from '../loan/offers/controllers/offers.controller';
import { LoggerModule } from '../logger/logger.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UserConsent } from './consent/entities/consent.entity';
import { ESignature } from './esignature/entities/esignature.entity';
import { UserDocuments } from './documents/entities/documents.entity';
import { LoansModule } from '../loan/loans.module';
import { AdminModule } from '../admin/admin.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { CountersModule } from '../counter/counters.module';
import { AppService } from '../app.service';
import { PdfModule } from '../pdf/pdf.module';
import { HtmlParserModule } from '../html-parser/html-parser.module';
import { UserController } from './controllers/user.controller';
import { EsignatureService } from './esignature/services/esignature.service';
import { EsignatureController } from './esignature/controllers/esignature.controller';
import { DocumentsController } from './documents/controllers/documents.controller';
import { AccountModule } from '../account/account.module';
import { LinkController } from './application/link/controllers/link.controller';
import { ApplicationLinkService } from './application/link/services/link.service';
import { ApplicationLink } from './application/link/entities/link.entity';
import linkConfig from './application/link/link.config';
import { EmailModule } from '../email/email.module';
import { SmsModule } from '../sms/sms.module';
import { AccountsController } from './accounts/controllers/accounts.controller';
import { AccountsService } from './accounts/services/accounts.service';
import { Accounts } from './accounts/entities/accounts.entity';
import { ScreenTrackingController } from './screen-tracking/controllers/screen-tracking.controller';
import { CardsController } from './cards/controllers/cards.controller';
import { CardsService } from './cards/services/cards.service';
import { Cards } from './cards/entities/cards.entity';
import { PaymentProviderModule } from '../payment-provider/payment-provider.module';
import { Payment } from './payments/entities/payment.entity';
import { PaymentController } from './payments/controllers/payment.controller';
import { PaymentService } from './payments/services/payment.service';
import { PaymentCronService } from './payments/services/payment-cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Accounts,
      User,
      Cards,
      ScreenTracking,
      UserActivity,
      UserConsent,
      ESignature,
      UserDocuments,
      ApplicationLink,
      Payment,
    ]),
    ConfigModule.forRoot({
      load: [linkConfig],
    }),
    LoggerModule,
    forwardRef(() => AuthenticationModule),
    forwardRef(() => LoansModule),
    forwardRef(() => AdminModule),
    FileStorageModule,
    CountersModule,
    PdfModule,
    HtmlParserModule,
    AccountModule,
    EmailModule,
    SmsModule,
    PaymentProviderModule,
  ],
  providers: [
    UserService,
    ScreenTrackingService,
    ActivityService,
    ConsentService,
    UserDocumentsService,
    AppService,
    EsignatureService,
    ApplicationLinkService,
    AccountsService,
    CardsService,
    PaymentService,
    PaymentCronService,
  ],
  controllers: [
    ConsentController,
    OffersController,
    UserController,
    EsignatureController,
    DocumentsController,
    LinkController,
    AccountsController,
    ScreenTrackingController,
    CardsController,
    PaymentController,
  ],
  exports: [
    TypeOrmModule,
    ConsentService,
    UserService,
    ScreenTrackingService,
    ActivityService,
    UserDocumentsService,
    ApplicationLinkService,
  ],
})
export class UserModule {}
