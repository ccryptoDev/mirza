import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { LoggerService } from '../../../logger/services/logger.service';

import { JwtAuthGuard } from '../../../authentication/strategies/jwt-auth.guard';
import { UserDocumentsService } from '../services/documents.service';
import UploadDocDto from '../validation/uploadDoc.dto';
import {
  AdminJwtPayload,
  UserJwtPayload,
} from '../../../authentication/types/jwt-payload.types';
import { Role } from '../../../authentication/roles/role.enum';
import { RolesGuard } from '../../../authentication/roles/guards/roles.guard';
import { Roles } from '../../../authentication/roles/roles.decorator';
import {
  LogActivityService,
  logActivityModuleNames,
} from '../../../admin/log-activity/services/log-activity.service';
import { BadRequestResponse } from '../../../types/bad-request-response';
import { ErrorResponse } from '../../../types/error-response';
import { UploadDocumentResponse } from '../types/upload-document-response';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api')
export class DocumentsController {
  constructor(
    private readonly userDocumentsService: UserDocumentsService,
    private readonly logger: LoggerService,
    private readonly logActivityService: LogActivityService,
  ) {}

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Get('admin/dashboard/users/documents/:screenTrackingId')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUserDocuments(
    @Param('screenTrackingId') screenTrackingId: string,
    @Req() request: Request,
  ) {
    try {
      const response = await this.userDocumentsService.getUserDocuments(
        screenTrackingId,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${DocumentsController.name}#getUserDocuments`,
        request.id,
        response,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${DocumentsController.name}#getUserDocuments`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiCreatedResponse({ type: UploadDocumentResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Post('admin/dashboard/users/documents/:screenTrackingId')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async uploadDocumentByAdmin(
    @Param('screenTrackingId') screenTrackingId: string,
    @Body() uploadDocDto: UploadDocDto,
    @Req() request: Request & { user: UserJwtPayload & AdminJwtPayload },
  ) {
    try {
      const response = await this.userDocumentsService.uploadDocument(
        uploadDocDto,
        request.id,
        request.user,
        screenTrackingId,
      );
      const { id, userName, email, role, merchant } = request.user;
      await this.logActivityService.createLogActivity(
        request,
        logActivityModuleNames.DOCUMENT_UPLOAD,
        `${request.user.email} - ${role} Uploaded document id ${response.documentId}`,
        {
          id,
          email,
          role,
          userName,
          merchantId: merchant,
          screenTrackingId,
          documentId: response.documentId,
        },
        undefined,
        undefined,
        screenTrackingId,
      );

      this.logger.log(
        'Response status 201',
        `${DocumentsController.name}#uploadDocument`,
        request.id,
        response,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${DocumentsController.name}#uploadDocument`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
