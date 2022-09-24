import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { S3Service } from './services/s3.service';
import { S3Controller } from './controllers/s3.controller';
import s3Config from './s3.config';
import { AppService } from '../app.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [ConfigModule.forRoot({ load: [s3Config] }), LoggerModule],
  providers: [S3Service, AppService],
  controllers: [S3Controller],
  exports: [S3Service],
})
export class FileStorageModule {}
