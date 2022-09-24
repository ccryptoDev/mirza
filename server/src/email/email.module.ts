import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import mandrilConfig from './sendgrid.config';
import { LoggerService } from '../logger/services/logger.service';
import { SendGridService } from './services/sendgrid.service';

@Module({
  imports: [ConfigModule.forRoot({ load: [mandrilConfig] })],
  providers: [SendGridService, LoggerService],
  exports: [SendGridService],
})
export class EmailModule {}
