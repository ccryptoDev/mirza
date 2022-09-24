import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { Admin } from './entities/admin.entity';
import { LogActivityService } from './log-activity/services/log-activity.service';
import { LogActivity } from './log-activity/entities/log-activity.entity';
import { LogActivityController } from './log-activity/controllers/log-activity.controller';
import { CommentsService } from './comments/services/comments.service';
import { CommentsController } from './comments/controllers/comments.controller';
import { MerchantService } from './merchant/services/merchant.service';
import { MerchantController } from './merchant/controllers/merchant.controller';
import { CountersModule } from '../counter/counters.module';
import { LoggerModule } from '../logger/logger.module';
import { LoansModule } from '../loan/loans.module';
import { Comments } from './comments/entities/comments.entity';
import { Merchant } from './merchant/entities/merchant.entity';
import { UserModule } from '../user/user.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { AppService } from '../app.service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { EmailModule } from '../email/email.module';
import { HtmlParserModule } from '../html-parser/html-parser.module';
import { Terms } from './merchant/entities/terms.entity';
import { ContractSettings } from './merchant/entities/contract-settings.entity';
import { CreditReportSettings } from './merchant/entities/credit-report-settings.entity';
import { LoanSettings } from './merchant/entities/loan-settings.entity';
import { Accounts } from './merchant/entities/accounts.entity';
import { Cards } from './merchant/entities/cards.entity';
import { Consents } from './merchant/entities/consents.entity';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      LogActivity,
      Comments,
      Merchant,
      Terms,
      ContractSettings,
      CreditReportSettings,
      LoanSettings,
      Accounts,
      Cards,
      Consents,
    ]),
    CountersModule,
    LoggerModule,
    forwardRef(() => LoansModule),
    forwardRef(() => UserModule),
    FileStorageModule,
    forwardRef(() => AuthenticationModule),
    EmailModule,
    HtmlParserModule,
    PdfModule,
  ],
  controllers: [
    AdminController,
    LogActivityController,
    CommentsController,
    MerchantController,
  ],
  providers: [
    AdminService,
    LogActivityService,
    CommentsService,
    MerchantService,
    AppService,
  ],
  exports: [
    TypeOrmModule,
    AdminService,
    LogActivityService,
    CommentsService,
    MerchantService,
  ],
})
export class AdminModule {}
