import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { EsignatureService } from '../services/esignature.service';
import { SaveSignatureDto } from '../validation/saveSignature.dto';
import { Request } from 'express';
import { LoggerService } from '../../../logger/services/logger.service';
import { JwtAuthGuard } from '../../../authentication/strategies/jwt-auth.guard';
import { BadRequestResponse } from '../../../types/bad-request-response';
import { ErrorResponse } from '../../../types/error-response';
import { ESignatureResponse } from '../types/esignature-response';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/application')
export class EsignatureController {
  constructor(
    private readonly esignatureService: EsignatureService,
    private readonly logger: LoggerService,
  ) {}

  @ApiCreatedResponse({ type: ESignatureResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Post('esignature')
  async saveSignature(
    @Body() saveSignatureDto: SaveSignatureDto,
    @Req() request: Request,
  ) {
    saveSignatureDto.screenTrackingId = request.user.screenTracking;
    try {
      const response = await this.esignatureService.saveSignature(
        saveSignatureDto,
        request,
      );

      this.logger.log(
        'Response status 201',
        `${EsignatureController.name}#saveSignature`,
        request.id,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${EsignatureController.name}#saveSignature`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
