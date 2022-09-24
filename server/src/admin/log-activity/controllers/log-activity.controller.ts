import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { LoggerService } from '../../../logger/services/logger.service';
import { JwtAuthGuard } from '../../../authentication/strategies/jwt-auth.guard';
import { Role } from '../../../authentication/roles/role.enum';
import { Roles } from '../../../authentication/roles/roles.decorator';
import { RolesGuard } from '../../../authentication/roles/guards/roles.guard';
import { LogActivityService } from '../services/log-activity.service';
import { GetAllLogActivitiesResponse } from '../types/get-all-log-activities-response';
import { BadRequestResponse } from '../../../types/bad-request-response';
import { ErrorResponse } from '../../../types/error-response';
import { LogsByUserResponse } from '../types/logs-by-user-response';

@ApiBearerAuth()
@Controller('/api/admin/dashboard/logActivities')
export class LogActivityController {
  constructor(
    private readonly logActivityService: LogActivityService,
    private readonly logger: LoggerService,
  ) {}

  @ApiOkResponse({ type: GetAllLogActivitiesResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Manager)
  @Get()
  async getAllLogActivities(
    @Req() request: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(25), ParseIntPipe) perPage: number,
    @Query('search') search: string,
  ) {
    try {
      const response = await this.logActivityService.getAllLogActivities(
        { page, perPage, search },
        request.id,
      );
      this.logger.log(
        'Response status 200',
        `${LogActivityController.name}#getAllLogActivities`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${LogActivityController.name}#getAllLogActivities`,
        request.id,
        error,
      );

      throw error;
    }
  }

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Manager)
  @Get(':id')
  async getLogActivityById(@Req() request: Request, @Param('id') id: string) {
    try {
      const response = await this.logActivityService.getLogActivityById(
        id,
        request.id,
      );
      this.logger.log(
        'Response status 200',
        `${LogActivityController.name}#getLogActivityById`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${LogActivityController.name}#getLogActivityById`,
        request.id,
        error,
      );

      throw error;
    }
  }

  @ApiOkResponse({ type: LogsByUserResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Manager)
  @Get('user/:screenTrackingId')
  async getLogActivityByScreenTrackingId(
    @Req() request: Request,
    @Param('screenTrackingId') screenTrackingId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(25), ParseIntPipe) perPage: number,
    @Query('search') search: string,
  ) {
    try {
      const response =
        await this.logActivityService.getLogActivitiesByScreenTrackingId(
          screenTrackingId,
          { page, perPage, search },
          request.id,
        );
      this.logger.log(
        'Response status 200',
        `${LogActivityController.name}#getLogActivityById`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${LogActivityController.name}#getLogActivityById`,
        request.id,
        error,
      );

      throw error;
    }
  }
}
