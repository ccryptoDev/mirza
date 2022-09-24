import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { LoggerService } from '../../../logger/services/logger.service';
import { JwtAuthGuard } from '../../../authentication/strategies/jwt-auth.guard';
import { BadRequestResponse } from '../../../types/bad-request-response';
import { ErrorResponse } from '../../../types/error-response';
import { ScreenTrackingService } from '../services/screen-tracking.service';

@Controller('/api')
export class ScreenTrackingController {
  constructor(
    private readonly screenTrackingService: ScreenTrackingService,
    private readonly logger: LoggerService,
  ) {}

  @ApiBearerAuth()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Post('application/setComplete')
  async setApplicationComplete(@Req() request: Request) {
    const { screenTracking } = request.user;
    try {
      await this.screenTrackingService.setApplicationCompleted(
        screenTracking,
        request.id,
      );

      this.logger.log(
        'Response status 204:',
        `${ScreenTrackingController.name}#setApplicationComplete`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${ScreenTrackingController.name}#setApplicationComplete`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
