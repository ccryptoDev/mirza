import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TwilioService } from './services/twilio.service';
import twilioConfig from './twilio.config';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [ConfigModule.forRoot({ load: [twilioConfig] }), LoggerModule],
  providers: [TwilioService],
  exports: [TwilioService],
})
export class SmsModule {}
