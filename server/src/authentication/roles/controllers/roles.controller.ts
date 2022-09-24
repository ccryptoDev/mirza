import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { LoggerService } from '../../../logger/services/logger.service';
import { JwtAuthGuard } from '../../strategies/jwt-auth.guard';
import { Role } from '../role.enum';
import { Roles } from '../roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { RolesService } from '../services/roles.service';

@ApiBearerAuth()
@Controller('/api/admin/roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAdminRoles(@Req() request: Request) {
    try {
      const response = await this.rolesService.getAdminRoles(request.id);

      this.logger.log(
        'Response status 200',
        `${RolesController.name}#getAdminRoles`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${RolesController.name}#getApplicationInformation`,
        request.id,
        error,
      );
    }
  }
}
