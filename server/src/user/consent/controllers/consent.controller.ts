import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

import { LoggerService } from '../../../logger/services/logger.service';
import { JwtAuthGuard } from '../../../authentication/strategies/jwt-auth.guard';
import { Role } from '../../../authentication/roles/role.enum';
import { Roles } from '../../../authentication/roles/roles.decorator';
import { RolesGuard } from '../../../authentication/roles/guards/roles.guard';
import { AdminJwtPayload } from '../../../authentication/types/jwt-payload.types';
import { ConsentService } from '../services/consent.service';

@Controller('/api')
export class ConsentController {
  constructor(
    private readonly userConsentService: ConsentService,
    private readonly logger: LoggerService,
  ) {}

  @ApiBearerAuth()
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/dashboard/users/consents/:screenTrackingId')
  async getUserConsents(
    @Param('screenTrackingId') screenTrackingId: string,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      const response = await this.userConsentService.getUserConsents(
        screenTrackingId,
        request.user,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${ConsentController.name}#getUserDocuments`,
        request.id,
        response,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${ConsentController.name}#getUserDocuments`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
