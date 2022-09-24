import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '../user/user.module';
import { ApplicationService } from '../user/application/services/application.service';
import { ApplicationController } from '../user/application/controllers/application.controller';
import { PaymentManagementCronService } from './payments/payment-management/services/payment-management-cron.service';
import { MathExtService } from './mathext/services/mathext.service';
import { LedgerService } from './ledger/services/ledger.service';
import { PaymentManagementService } from './payments/payment-management/services/payment-management.service';
import { PaymentManagementController } from './payments/payment-management/controllers/payment-management.controller';
import { PaymentService } from '../user/payments/services/payment.service';
import { PaymentController } from '../user/payments/controllers/payment.controller';
import { PaymentCronService } from '../user/payments/services/payment-cron.service';
import { LoanpaymentproService } from './payments/loanpaymentpro/services/loanpaymentpro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentManagement } from './payments/payment-management/entities/payment-management.entity';
import { LoanSettings } from '../admin/merchant/entities/loan-settings.entity';
import { Payment } from '../user/payments/entities/payment.entity';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { AppService } from '../app.service';
import { LoggerModule } from '../logger/logger.module';
import { EmailModule } from '../email/email.module';
import { HtmlParserModule } from '../html-parser/html-parser.module';
import { CountersModule } from '../counter/counters.module';
import { AdminModule } from '../admin/admin.module';
import { SmsModule } from '../sms/sms.module';
import loanPaymentProConfig from './payments/loanpaymentpro/loanpaymentpro.config';
import { OffersController } from './offers/controllers/offers.controller';
import { OffersService } from './offers/services/offers.service';
import { PaymentProviderModule } from '../payment-provider/payment-provider.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentManagement, LoanSettings, Payment]),
    ConfigModule.forRoot({
      load: [loanPaymentProConfig],
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AdminModule),
    forwardRef(() => CountersModule),
    FileStorageModule,
    LoggerModule,
    EmailModule,
    HtmlParserModule,
    SmsModule,
    PaymentProviderModule,
  ],
  providers: [
    ApplicationService,
    PaymentManagementCronService,
    MathExtService,
    LedgerService,
    PaymentManagementService,
    PaymentService,
    PaymentCronService,
    LoanpaymentproService,
    AppService,
    OffersService,
  ],
  controllers: [
    ApplicationController,
    PaymentManagementController,
    PaymentController,
    OffersController,
  ],
  exports: [
    TypeOrmModule,
    ApplicationService,
    MathExtService,
    LedgerService,
    PaymentManagementService,
    PaymentService,
    LoanpaymentproService,
    OffersService,
  ],
})
export class LoansModule {}
