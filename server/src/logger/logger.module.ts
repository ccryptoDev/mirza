import { Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { RequestLoggerService } from './services/request-logger.service';

@Module({
  providers: [LoggerService, RequestLoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
