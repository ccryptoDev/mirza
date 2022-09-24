import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'crypto';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ScreenTracking } from '../../screen-tracking/entities/screen-tracking.entity';
import { User } from '../../entities/user.entity';
import { ESignature } from '../entities/esignature.entity';
import { SaveSignatureDto } from '../validation/saveSignature.dto';
import { LoggerService } from '../../../logger/services/logger.service';
import { UserConsent } from '../../consent/entities/consent.entity';
import { S3Service } from '../../../file-storage/services/s3.service';
import { AppService } from '../../../app.service';

@Injectable()
export class EsignatureService {
  constructor(
    @InjectRepository(ScreenTracking)
    private readonly screenTrackingRepository: Repository<ScreenTracking>,
    @InjectRepository(ESignature)
    private readonly esignatureRepository: Repository<ESignature>,
    @InjectRepository(UserConsent)
    private readonly userConsentRepository: Repository<UserConsent>,
    private readonly s3Service: S3Service,
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {}

  async saveSignature(saveSignatureDto: SaveSignatureDto, request: Request) {
    this.logger.log(
      'Saving signature with arguments',
      `${EsignatureService.name}#saveSignature`,
      request.id,
      saveSignatureDto,
    );
    const { screenTrackingId, hiddenSignatureId, imgBase64 } = saveSignatureDto;
    const ip: string = this.appService.getIPAddress(request);
    const userAgent: string = request.headers['user-agent'];
    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne({
        where: {
          id: screenTrackingId,
        },
        relations: ['user'],
      });

    if (!screenTracking) {
      const errorMessage = `Screen tracking id ${screenTracking.id} not found`;
      this.logger.error(
        errorMessage,
        `${EsignatureService.name}#saveSignature`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const existingEsignature: ESignature | null =
      await this.esignatureRepository.findOne({
        screenTracking: screenTracking.id,
      });
    if (existingEsignature) {
      const errorMessage = 'Esignature already exists';
      this.logger.error(
        errorMessage,
        `${EsignatureService.name}#saveSignature`,
        request.id,
      );
      throw new ForbiddenException(undefined, errorMessage);
    }
    if (!screenTracking.user) {
      const errorMessage = 'User for this screen tracking not found';
      this.logger.error(
        errorMessage,
        `${EsignatureService.name}#saveSignature`,
        request.id,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const user: User = screenTracking.user as User;
    // const userConsent: UserConsent | null =
    //   await this.userConsentRepository.findOne({
    //     screenTracking: screenTracking.id,
    //   });
    // if (!userConsent) {
    //   const errorMessage = `Consent id ${userConsent.id} not found`;
    //   this.logger.error(
    //     errorMessage,
    //     `${EsignatureService.name}#saveSignature`,
    //     request.id,
    //   );
    //   throw new NotFoundException(undefined, errorMessage);
    // }
    const seed: Buffer = crypto.randomBytes(20);
    const uniqueSHA1String = crypto
      .createHash('sha1')
      .update(seed)
      .digest('hex');
    const fileData: {
      fileExtension: string;
      buffer: Buffer;
    } = this.base64PngToBuffer(imgBase64, request.id);
    const fileName = `image-${uniqueSHA1String}`;
    if (!hiddenSignatureId) {
      const s3Path = `Esignature/${user.userReference}/${screenTracking.applicationReference}/${fileName}.${fileData.fileExtension}`;
      const esignature: ESignature = this.esignatureRepository.create({
        device: userAgent,
        fullName: `${user.firstName} ${user.lastName}`,
        ipAddress: ip,
        screenTracking: screenTrackingId,
        signature: `${fileName}.${fileData.fileExtension}`,
        signaturePath: s3Path,
        user: user.id,
      });
      await this.esignatureRepository.save(esignature);

      await this.s3Service.uploadFile(
        s3Path,
        fileData.buffer,
        'image/png',
        request.id,
      );
      await this.screenTrackingRepository.update(
        { id: screenTrackingId },
        { lastLevel: 'sign-contract' },
      );

      const response = {
        esignatureId: esignature.id,
      };
      this.logger.log(
        'Saved signature.',
        `${EsignatureService.name}#saveSignature`,
        request.id,
        response,
      );

      return response;
    } else {
      const updateParams = {
        fullName: `${user.firstName} ${user.lastName}`,
        ipAddress: ip,
        device: userAgent,
      };
      this.logger.log(
        'Updating existing signature with arguments',
        `${EsignatureService.name}#saveSignature`,
        request.id,
        updateParams,
      );
      await this.esignatureRepository.update(
        { id: hiddenSignatureId },
        updateParams,
      );
      const response = {
        esignatureId: hiddenSignatureId,
      };
      this.logger.log(
        'Updated existing signature',
        `${EsignatureService.name}#saveSignature`,
        request.id,
        response,
      );

      return response;
    }
  }

  base64PngToBuffer(imageBase64: string, requestId: string) {
    this.logger.log(
      'Converting base64 image to buffer...',
      `${EsignatureService.name}#base64PngToBuffer`,
      requestId,
    );
    const pngExtensionSignature = 'iVBORw0KGgo';
    if (!(imageBase64.indexOf(pngExtensionSignature) === 0)) {
      const errorMessage = 'Only PNG files are supported';
      throw new BadRequestException(undefined, errorMessage);
    }

    const response = {
      fileExtension: 'png',
      buffer: Buffer.from(imageBase64, 'base64'),
    };
    this.logger.log(
      'Finished converting base64 image to buffer.',
      `${EsignatureService.name}#base64PngToBuffer`,
      requestId,
    );

    return response;
  }
}
