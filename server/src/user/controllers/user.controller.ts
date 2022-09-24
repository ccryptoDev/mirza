import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
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

import { LoggerService } from '../../logger/services/logger.service';
import { JwtAuthGuard } from '../../authentication/strategies/jwt-auth.guard';
import { UserService } from '../services/user.service';
import { BadRequestResponse } from '../../types/bad-request-response';
import { ErrorResponse } from '../../types/error-response';
import { GetUserResponse } from '../types/get-user-response';
import { UpdatePasswordAndPhonesDto } from '../validation/update-user-data.dto';
import { GetDashboardResponse } from '../types/get-dashboard-response';
import { GetAllUsersResponse } from '../types/get-all-users-response';
import { Role } from '../../authentication/roles/role.enum';
import { Roles } from '../../authentication/roles/roles.decorator';
import { RolesGuard } from '../../authentication/roles/guards/roles.guard';
import { AdminJwtPayload } from '../../authentication/types/jwt-payload.types';
import { GetUserInfoResponse } from '../validation/get-user-info-response';

@Controller('/api')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
  ) {}

  @ApiBearerAuth()
  @ApiOkResponse({ type: GetUserResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard)
  @Get('application/user')
  async getApplicationInformation(@Req() request: Request) {
    const screenTracking: string = request.user.screenTracking;
    try {
      const response = await this.userService.getApplicationInformation(
        screenTracking,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${UserController.name}#getApplicationInformation`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${UserController.name}#getApplicationInformation`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: GetAllUsersResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Get('admin/dashboard/users')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllUsers(
    @Req() request: Request & { user: AdminJwtPayload },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(25), ParseIntPipe) perPage: number,
    @Query('search') search: string,
  ) {
    try {
      const response = await this.userService.getAllUsers(
        request.user,
        { page, perPage, search },
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${UserController.name}#getAllUsers`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${UserController.name}#getAllUsers`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: GetUserInfoResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Get('admin/dashboard/users/:userId')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUserInfo(@Req() request: Request, @Param('userId') userId: string) {
    this.logger.log(
      'Request params:',
      `${UserController.name}#getUserInfo`,
      request.id,
      userId,
    );

    try {
      const info = await this.userService.getInfo(userId, request.id);
      this.logger.log(
        'Return user info: ',
        `${UserController.name}#getUserInfo`,
        request.id,
        info,
      );

      return info;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${UserController.name}#getUserInfo`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Patch('application/user')
  async updatePasswordAndPhones(
    @Body() updateUserDataDto: UpdatePasswordAndPhonesDto,
    @Req() request: Request,
  ) {
    const userId: string = request.user.id;
    try {
      const response = await this.userService.updatePasswordAndPhones(
        userId,
        updateUserDataDto,
        request.id,
      );

      this.logger.log(
        'Response status 204',
        `${UserController.name}#updatePasswordAndPhoneNumbers`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${UserController.name}#updatePasswordAndPhoneNumbers`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: GetDashboardResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard)
  @Get('application/dashboard')
  async getDashboard(@Req() request: Request) {
    const userId = request.user.id;
    try {
      const response = await this.userService.getDashboard(userId, request.id);
      this.logger.log(
        'Response status 200',
        `${UserController.name}#getDashboard`,
        request.id,
        response,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${UserController.name}#getDashboard`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
