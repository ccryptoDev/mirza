import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWSError } from 'aws-sdk';
import S3, { ManagedUpload } from 'aws-sdk/clients/s3';
import { PromiseResult } from 'aws-sdk/lib/request';

import { LoggerService } from '../../logger/services/logger.service';

@Injectable()
export class S3Service {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async uploadFile(
    path: string,
    body: Buffer,
    contentType: string,
    requestId: string,
  ) {
    this.logger.log(
      'Uploading file to s3 with arguments',
      `${S3Service.name}#uploadFile`,
      requestId,
      { path, body, contentType },
    );
    const client: S3 = this.configService.get<AWS.S3>('s3Client');
    const uploadOptions = this.configService.get<{
      Bucket: string;
      SSEKMSKeyId: string;
      ServerSideEncryption: string;
    }>('s3UploadOptions');
    const uploadParams: AWS.S3.PutObjectRequest = {
      ...uploadOptions,
      Key: path,
      Body: body,
      ContentType: contentType,
      CacheControl: 'max-age=604800',
    };

    const response: ManagedUpload.SendData = await client
      .upload(uploadParams)
      .promise();
    this.logger.log(
      'File uploaded to S3',
      `${S3Service.name}#uploadFile`,
      requestId,
      response,
    );

    return response;
  }

  async downloadFile(
    path: string,
    requestId: string,
  ): Promise<PromiseResult<S3.GetObjectOutput, AWSError>> {
    this.logger.log(
      'Getting s3 asset with arguments',
      `${S3Service.name}#s3asset`,
      requestId,
      path,
    );
    const client: S3 = this.configService.get<AWS.S3>('s3Client');
    const bucket = this.configService.get<string>('Bucket');
    let file: PromiseResult<S3.GetObjectOutput, AWSError>;
    try {
      file = await client.getObject({ Bucket: bucket, Key: path }).promise();
    } catch (error) {
      if (error.statusCode === 404) {
        const errorMessage = 'File not found';
        this.logger.error(errorMessage, `${S3Service.name}#s3asset`, requestId);
        throw new NotFoundException(undefined, errorMessage);
      }
    }

    return file;
  }

  getS3Url(path: string) {
    const baseUrl = this.configService.get<string>('baseUrl');
    return `${baseUrl}/api/application/s3asset/${path}`;
  }
}
