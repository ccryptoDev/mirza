import {
  Body,
  Controller,
  ForbiddenException,
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
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../../../../authentication/strategies/jwt-auth.guard';
import { AdminJwtPayload } from '../../../../authentication/types/jwt-payload.types';
import { PaymentManagementCronService } from '../services/payment-management-cron.service';
import { BadRequestResponse } from '../../../../types/bad-request-response';
import { ErrorResponse } from '../../../../types/error-response';
import { Role } from '../../../../authentication/roles/role.enum';
import { Roles } from '../../../../authentication/roles/roles.decorator';
import { RolesGuard } from '../../../../authentication/roles/guards/roles.guard';
import { LoggerService } from '../../../../logger/services/logger.service';
import { PaymentManagementService } from '../services/payment-management.service';
import { ChangePaymentAmountDto } from '../validation/change-payment-amount.dto';
import {
  LogActivityService,
  logActivityModuleNames,
} from '../../../../admin/log-activity/services/log-activity.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api')
export class PaymentManagementController {
  constructor(
    private readonly logActivityService: LogActivityService,
    private readonly paymentManagementService: PaymentManagementService,
    private readonly paymentManagementCron: PaymentManagementCronService,
    private readonly logger: LoggerService,
  ) {}

  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Get('admin/dashboard/loans/paymentSchedule/:screenTrackingId')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getPaymentSchedule(
    @Param('screenTrackingId') screenTrackingId: string,
    @Req() request: Request,
  ) {
    try {
      const response = await this.paymentManagementService.getPaymentSchedule(
        screenTrackingId,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${PaymentManagementController.name}#getPaymentSchedule`,
        request.id,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentManagementController.name}#getPaymentSchedule`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @HttpCode(204)
  @Patch('admin/dashboard/loans/changePaymentAmount/:screenTrackingId')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async changePaymentAmount(
    @Param('screenTrackingId') screenTrackingId: string,
    @Body() changePaymentAmountDto: ChangePaymentAmountDto,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    changePaymentAmountDto.screenTracking = screenTrackingId;

    try {
      await this.paymentManagementService.changeMonthlyPaymentAmount(
        changePaymentAmountDto,
        request.id,
      );
      const { id, userName, email, role, merchant } = request.user;
      await this.logActivityService.createLogActivity(
        request,
        logActivityModuleNames.PAYMENT_SCHEDULE,
        `${request.user.email} - ${role} Changed current payment amount to ${changePaymentAmountDto.amount}`,
        {
          id,
          email,
          role,
          userName,
          merchantId: merchant,
          screenTrackingId,
        },
        undefined,
        undefined,
        screenTrackingId,
      );

      this.logger.log(
        'Response status 200',
        `${PaymentManagementController.name}#changePaymentAmount`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentManagementController.name}#changePaymentAmount`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @Post('test/checkExpiredApplications')
  async runAutomaticPayments() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException();
    }

    try {
      await this.paymentManagementCron.checkExpiredApplications();
    } catch (error) {
      throw error;
    }
  }

  @Post('test/runDelinquencyCron')
  async runDelinquencyCron() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException();
    }

    try {
      await this.paymentManagementCron.delinquencyCron();
    } catch (error) {
      throw error;
    }
  }
}
