import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../../logger/services/logger.service';
import stream from 'stream';

import { S3Service } from '../services/s3.service';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../../types/error-response';

@Controller('/api/application/s3asset')
export class S3Controller {
  constructor(
    private readonly s3Service: S3Service,
    private readonly logger: LoggerService,
  ) {}

  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Get('*')
  async s3asset(
    @Param() params: any,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const s3Path = params[0];
      const file = await this.s3Service.downloadFile(s3Path, request.id);

      response.set({
        'Content-Type': file.ContentType,
        'Content-Length': file.ContentLength,
      });

      this.logger.log(
        'Response status 200',
        `${S3Controller.name}#s3asset`,
        request.id,
        file.Body,
      );
      const assetStream = new stream.PassThrough();
      assetStream.end(file.Body);
      assetStream.pipe(response);
    } catch (error) {
      this.logger.error(
        'Error:',
        `${S3Controller.name}#s3asset`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
