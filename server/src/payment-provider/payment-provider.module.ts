import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CliqController } from './controllers/cliq.controller';
import { CliqService } from './services/cliq.service';
import { LoggerModule } from '../logger/logger.module';
import cliqConfig from './cliq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [cliqConfig],
    }),
    LoggerModule,
  ],
  controllers: [CliqController],
  providers: [CliqService],
  exports: [CliqService],
})
export class PaymentProviderModule {}
