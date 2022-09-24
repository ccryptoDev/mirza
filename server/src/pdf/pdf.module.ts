import { Module } from '@nestjs/common';

import { PuppeteerService } from './services/puppeteer.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [PuppeteerService],
  exports: [PuppeteerService],
})
export class PdfModule {}
