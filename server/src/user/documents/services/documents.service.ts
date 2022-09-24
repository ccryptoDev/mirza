import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ManagedUpload } from 'aws-sdk/clients/s3';

import { LoggerService } from '../../../logger/services/logger.service';
import { S3Service } from '../../../file-storage/services/s3.service';
import { User } from '../../entities/user.entity';
import { UserDocuments } from '../entities/documents.entity';
import UploadDocDto from '../validation/uploadDoc.dto';
import {
  AdminJwtPayload,
  UserJwtPayload,
} from '../../../authentication/types/jwt-payload.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScreenTracking } from 'src/user/screen-tracking/entities/screen-tracking.entity';

@Injectable()
export class UserDocumentsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserDocuments)
    private readonly userDocumentsRepository: Repository<UserDocuments>,
    @InjectRepository(ScreenTracking)
    private readonly screenTrackingRepository: Repository<ScreenTracking>,
    private readonly s3Service: S3Service,
    private readonly logger: LoggerService,
  ) {}

  async uploadDocument(
    uploadDocDto: UploadDocDto,
    requestId: string,
    uploaderPayload: AdminJwtPayload & UserJwtPayload,
    screenTrackingId?: string,
  ): Promise<{ documentId: string }> {
    const { documentType, driversLicenseBack, driversLicenseFront, passport } =
      uploadDocDto;
    let { userId } = uploadDocDto;
    this.logger.log(
      "Uploading user's document with arguments",
      `${UserDocumentsService.name}#uploadDocument`,
      requestId,
      uploadDocDto,
    );

    let user: User | null;
    if (screenTrackingId) {
      const screenTracking = await this.screenTrackingRepository.findOne({
        where: {
          id: screenTrackingId,
        },
        relations: ['user'],
      });
      user = screenTracking.user as User;
    } else {
      user = await this.userRepository.findOne({
        id: userId,
      });
    }
    if (!user) {
      const errorMessage = screenTrackingId
        ? `User not found for screen tracking id ${screenTrackingId}`
        : `User id ${userId} not found`;
      this.logger.error(
        errorMessage,
        `${UserDocumentsService.name}#uploadDocument`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    if (screenTrackingId) {
      userId = user.id;
    }
    if (documentType === 'drivers license') {
      const driversLicenseFrontFormat: {
        extension: string;
        contentType: string;
      } = this.getBase64FileFormat(driversLicenseFront, requestId);
      const driversLicenseBackFormat: {
        extension: string;
        contentType: string;
      } = this.getBase64FileFormat(driversLicenseBack, requestId);
      const driversLicenseFrontBuffer = Buffer.from(
        driversLicenseFront,
        'base64',
      );
      const driversLicenseBackBuffer = Buffer.from(
        driversLicenseBack,
        'base64',
      );
      const s3Response: ManagedUpload.SendData[] = await Promise.all([
        this.s3Service.uploadFile(
          `UserDocuments/${userId}/DriversLicense/front.${driversLicenseFrontFormat.extension}`,
          driversLicenseFrontBuffer,
          driversLicenseFrontFormat.contentType,
          requestId,
        ),
        this.s3Service.uploadFile(
          `UserDocuments/${userId}/DriversLicense/back.${driversLicenseFrontFormat.extension}`,
          driversLicenseBackBuffer,
          driversLicenseBackFormat.contentType,
          requestId,
        ),
      ]);
      const s3DocumentsPath: string[] = s3Response.map((document) =>
        document.Location.split('/').slice(3).join('/'),
      );
      const driversLicense = {
        front: this.s3Service.getS3Url(s3DocumentsPath[0]),
        back: this.s3Service.getS3Url(s3DocumentsPath[1]),
      };

      let userDocuments: UserDocuments = this.userDocumentsRepository.create({
        driversLicense: driversLicense,
        user: userId,
        uploaderRole: uploaderPayload.role,
        uploaderName:
          uploaderPayload.role === 'User'
            ? `${uploaderPayload.firstName} ${uploaderPayload.lastName}`
            : uploaderPayload.userName,
        uploaderId: uploaderPayload.id,
      });
      userDocuments = await this.userDocumentsRepository.save(userDocuments);

      const response = { documentId: userDocuments.id as string };
      this.logger.log(
        "User's document uploaded",
        `${UserDocumentsService.name}#uploadDocument`,
        requestId,
        response,
      );

      return response;
    }

    // handle passport upload
    const passportFormat: {
      extension: string;
      contentType: string;
    } = this.getBase64FileFormat(passport, requestId);
    const passportBuffer = Buffer.from(passport, 'base64');
    const s3Response = await this.s3Service.uploadFile(
      `UserDocuments/${userId}/passport.${passportFormat.extension}`,
      passportBuffer,
      passportFormat.contentType,
      requestId,
    );
    let userDocuments = this.userDocumentsRepository.create({
      passport: this.s3Service.getS3Url(
        s3Response.Location.split('/').slice(3).join('/'),
      ),
      user: userId,
      uploaderRole: uploaderPayload.role,
      uploaderName:
        uploaderPayload?.firstName ?? uploaderPayload?.userName ?? 'no name',
      uploaderId: uploaderPayload.id,
    });
    userDocuments = await this.userDocumentsRepository.save(userDocuments);

    const response = { documentId: userDocuments.id as string };
    this.logger.log(
      "User's document uploaded",
      `${UserDocumentsService.name}#uploadDocument`,
      requestId,
      response,
    );

    return response;
  }

  async getUserDocuments(screenTrackingId: string, requestId: string) {
    this.logger.log(
      'Getting user documents with arguments',
      `${UserDocumentsService.name}#getUserDocuments`,
      requestId,
      { screenTrackingId },
    );

    const screenTracking: ScreenTracking | null =
      await this.screenTrackingRepository.findOne({
        where: {
          id: screenTrackingId,
        },
        relations: ['user'],
      });
    const user = screenTracking.user as User;
    if (!user) {
      const errorMessage = `Could not find user for screen tracking id ${screenTrackingId}`;
      this.logger.error(
        errorMessage,
        `${UserDocumentsService.name}#getUserDocuments`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const userDocuments: UserDocuments[] | null =
      await this.userDocumentsRepository.find({
        user: user.id,
      });

    if (!userDocuments || userDocuments.length <= 0) {
      const errorMessage = `No documents found for user id ${user.id}`;
      this.logger.error(
        errorMessage,
        `${UserDocumentsService.name}#getUserDocuments`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    this.logger.log(
      'Got user documents:',
      `${UserDocumentsService.name}#getUserDocuments`,
      requestId,
      userDocuments,
    );

    return userDocuments;
  }

  getBase64FileFormat(
    imageBase64: string,
    requestId: string,
  ): { extension: string; contentType: string } {
    this.logger.log(
      'Getting file format for base64 string',
      `${UserDocumentsService.name}#getBase64FileFormat`,
      requestId,
      imageBase64,
    );
    const fileExtensionSignatures = {
      iVBORw0KGgo: { extension: 'png', contentType: 'image/png' },
      JVBERi0: { extension: 'pdf', contentType: 'application/pdf' },
      '/9j/': { extension: 'jpeg', contentType: 'image/jpeg' },
    };
    let isFormatSupported = false;

    const response: { extension: string; contentType: string } = {
      extension: '',
      contentType: '',
    };
    for (const extensionSignature in fileExtensionSignatures) {
      if (
        Object.prototype.hasOwnProperty.call(
          fileExtensionSignatures,
          extensionSignature,
        )
      ) {
        if (imageBase64.indexOf(extensionSignature) === 0) {
          response.extension =
            fileExtensionSignatures[extensionSignature].extension;
          response.contentType =
            fileExtensionSignatures[extensionSignature].contentType;
          isFormatSupported = true;

          break;
        }
      }
    }

    if (!isFormatSupported) {
      throw new BadRequestException(
        undefined,
        'Only .png, .jpeg or .pdf files are supported',
      );
    }

    this.logger.log(
      'Base 64 file format:',
      `${UserDocumentsService.name}#getBase64FileFormat`,
      requestId,
      response,
    );

    return response;
  }
}
