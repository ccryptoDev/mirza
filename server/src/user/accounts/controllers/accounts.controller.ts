import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { Role } from '../../../authentication/roles/role.enum';
import { Roles } from '../../../authentication/roles/roles.decorator';
import { RolesGuard } from '../../../authentication/roles/guards/roles.guard';
import { AddAccountDto } from '../validation/add-account.dto';
import { AccountsService } from '../services/accounts.service';
import { Accounts } from '../entities/accounts.entity';
import { SetDefaultPaymentMethodDto } from '../validation/set-default-payment-method.dto';
import { AddAccount } from '../validation/add-account.pipe';

@Controller('/api')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly logger: LoggerService,
  ) {}

  @ApiBearerAuth()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Post('application/users/accounts')
  async addAccount(
    @Body(new AddAccount()) addAccountDto: AddAccountDto,
    @Req() request: Request,
  ) {
    const { screenTracking } = request.user;
    try {
      await this.accountsService.addAccount(
        screenTracking,
        addAccountDto,
        request.id,
      );

      this.logger.log(
        'Response status 201:',
        `${AccountsController.name}#addAccount`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AccountsController.name}#addAccount`,
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @HttpCode(204)
  @Post('admin/dashboard/users/accounts/:screenTrackingId')
  async addAccountByScreenTrackingId(
    @Param('screenTrackingId') screenTrackingId: string,
    @Body() addAccountDto: AddAccountDto,
    @Req() request: Request,
  ) {
    try {
      await this.accountsService.addAccount(
        screenTrackingId,
        addAccountDto,
        request.id,
      );

      this.logger.log(
        'Response status 201:',
        `${AccountsController.name}#addAccount`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AccountsController.name}#addAccount`,
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
  @Get('application/users/accounts')
  async getAccounts(@Req() request: Request): Promise<Accounts[]> {
    const { screenTracking } = request.user;
    try {
      const response: Accounts[] = await this.accountsService.getAccounts(
        screenTracking,
        request.id,
      );

      this.logger.log(
        'Response status 200:',
        `${AccountsController.name}#getAccounts`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AccountsController.name}#getAccounts`,
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @Get('admin/dashboard/users/accounts/:screenTrackingId')
  async getAccountsByScreenTrackingId(
    @Param('screenTrackingId') screenTrackingId: string,
    @Req() request: Request,
  ): Promise<Accounts[]> {
    try {
      const response: Accounts[] = await this.accountsService.getAccounts(
        screenTrackingId,
        request.id,
      );

      this.logger.log(
        'Response status 200:',
        `${AccountsController.name}#getAccountsByScreenTrackingId`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AccountsController.name}#getAccountsByScreenTrackingId`,
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
  @Patch('application/users/accounts')
  async setDefaultPaymentMethod(
    @Body()
    setDefaultPaymentMethod: SetDefaultPaymentMethodDto,
    @Req() request: Request,
  ) {
    const { screenTracking } = request.user;

    try {
      await this.accountsService.setDefaultPaymentMethod(
        screenTracking,
        setDefaultPaymentMethod,
        request.id,
      );

      this.logger.log(
        'Response status 204',
        `${AccountsController.name}#setDefaultPaymentMethod`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AccountsController.name}#setDefaultPaymentMethod`,
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @HttpCode(204)
  @Patch('admin/dashboard/users/accounts/:screenTrackingId')
  async setDefaultPaymentMethodByScreenTrackingId(
    @Param('screenTrackingId') screenTrackingId: string,
    @Body()
    setDefaultPaymentMethod: SetDefaultPaymentMethodDto,
    @Req() request: Request,
  ) {
    try {
      await this.accountsService.setDefaultPaymentMethod(
        screenTrackingId,
        setDefaultPaymentMethod,
        request.id,
      );

      this.logger.log(
        'Response status 204',
        `${AccountsController.name}#setDefaultPaymentMethodByScreenTrackingId`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${AccountsController.name}#setDefaultPaymentMethodByScreenTrackingId`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
