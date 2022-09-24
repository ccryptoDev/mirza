import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { Role } from '../../authentication/roles/role.enum';
import { Roles } from '../../authentication/roles/roles.decorator';
import { RolesGuard } from '../../authentication/roles/guards/roles.guard';
import { LoggerService } from '../../logger/services/logger.service';
import { GetLoanCounters } from '../types/get-loan-counter-response';
import { BadRequestResponse } from '../../types/bad-request-response';
import { ErrorResponse } from '../../types/error-response';
import { JwtAuthGuard } from '../../authentication/strategies/jwt-auth.guard';
import { AdminJwtPayload } from '../../authentication/types/jwt-payload.types';
import { CountersService } from '../services/counters.service';

@Controller('/api')
export class CounterController {
  constructor(
    private readonly counterService: CountersService,
    private readonly logger: LoggerService,
  ) {}

  @ApiOkResponse({ type: GetLoanCounters })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Get('admin/dashboard/loans/counters')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getLoanCounters(@Req() request: Request & { user: AdminJwtPayload }) {
    this.logger.log(
      'Request params:',
      `${CounterController.name}#getLoanCounters`,
      request.id,
    );

    try {
      const { role, merchant } = request.user;
      const stats = await this.counterService.getLoanCounters(
        role,
        merchant,
        request.id,
      );
      this.logger.log(
        'Return data:',
        `${CounterController.name}#getLoanCounters`,
        request.id,
        stats,
      );

      return stats;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${CounterController.name}#getLoanCounters`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
