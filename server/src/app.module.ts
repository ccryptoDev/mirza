import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { resolve } from 'path';
import history from 'connect-history-api-fallback';

import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { LoggerModule } from './logger/logger.module';
import { RequestLoggerService } from './logger/services/request-logger.service';
import { UserModule } from './user/user.module';
import { CountersModule } from './counter/counters.module';
import { AdminModule } from './admin/admin.module';
import { LoansModule } from './loan/loans.module';
import { EmailModule } from './email/email.module';
import { SmsModule } from './sms/sms.module';
import { PdfModule } from './pdf/pdf.module';
import { HtmlParserModule } from './html-parser/html-parser.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { AccountModule } from './account/account.module';
import { PaymentProviderModule } from './payment-provider/payment-provider.module';
import { PlaidModule } from './plaid/plaid.module';
import appConfig from './app.config';

const {
  databasePort,
  databaseUsername,
  databasePassword,
  databaseName,
  synchronizeDatabase,
  databaseHost,
} = appConfig();

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ load: [appConfig], isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '../../../client/build'),
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: databaseHost,
      port: databasePort,
      username: databaseUsername,
      password: databasePassword,
      database: databaseName,
      synchronize: synchronizeDatabase,
      autoLoadEntities: true,
    }),
    AuthenticationModule,
    LoggerModule,
    UserModule,
    CountersModule,
    AdminModule,
    LoansModule,
    EmailModule,
    SmsModule,
    PdfModule,
    HtmlParserModule,
    FileStorageModule,
    AccountModule,
    PaymentProviderModule,
    PlaidModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(history()).exclude('/api(.*)');
    consumer.apply(RequestLoggerService).forRoutes('*');
  }
}
