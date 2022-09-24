import { Module } from '@nestjs/common';

import { NunjucksService } from './services/nunjucks.service';

@Module({
  providers: [NunjucksService],
  exports: [NunjucksService],
})
export class HtmlParserModule {}
