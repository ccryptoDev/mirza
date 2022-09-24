import { Get, HttpCode, Param, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Req } from '@nestjs/common';
import { Body } from '@nestjs/common';
import {
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import moment from 'moment';

import { LoggerService } from '../../../logger/services/logger.service';
import { JwtAuthGuard } from '../../../authentication/strategies/jwt-auth.guard';
import { Role } from '../../../authentication/roles/role.enum';
import { Roles } from '../../../authentication/roles/roles.decorator';
import { RolesGuard } from '../../../authentication/roles/guards/roles.guard';
import { PaymentCronService } from '../services/payment-cron.service';
import { PaymentManagementService } from '../../../loan/payments/payment-management/services/payment-management.service';
import { PaymentService } from '../services/payment.service';
import { MakePaymentDto } from '../validation/makePayment.dto';
import { ScreenTracking } from '../../screen-tracking/entities/screen-tracking.entity';
import { AdminJwtPayload } from '../../../authentication/types/jwt-payload.types';
import { BadRequestResponse } from '../../../types/bad-request-response';
import { ErrorResponse } from '../../../types/error-response';
import { PreviewPaymentResponse } from '../../../types/preview-payment-response';
import { MakePaymentDialogDto } from '../validation/make-payment-dialog.dto';
import { MakePaymentDialogPipe } from '../validation/make-payment-dialog.pipe';
import { SubmitPaymentDto } from '../validation/submit-payment.dto';
import {
  LogActivityService,
  logActivityModuleNames,
} from '../../../admin/log-activity/services/log-activity.service';
import { EnableAutopayDto } from '../validation/enable-autopay.dto';
import { PaymentManagement } from '../../../loan/payments/payment-management/entities/payment-management.entity';
import { User } from '../../entities/user.entity';

@Controller('/api')
export class PaymentController {
  constructor(
    @InjectRepository(ScreenTracking)
    private readonly screenTrackingRepository: Repository<ScreenTracking>,
    private readonly paymentService: PaymentService,
    private readonly paymentCronService: PaymentCronService,
    private readonly paymentManagementService: PaymentManagementService,
    private readonly logActivityService: LogActivityService,
    private readonly logger: LoggerService,
  ) {}

  @ApiBearerAuth()
  @Post('test/automaticPayment')
  async runAutomaticPayments() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException();
    }

    try {
      await this.paymentCronService.makeAutomaticPayment();
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Post('application/makePayment')
  async makePayment(
    @Body() makePaymentDto: MakePaymentDto,
    @Req() request: Request,
  ) {
    const { amount, paymentMethodToken } = makePaymentDto;
    const { id: userId, screenTracking } = request.user;

    try {
      await this.paymentService.makeDownPayment(
        userId,
        screenTracking,
        amount,
        paymentMethodToken,
        request.id,
      );

      await this.paymentManagementService.setInRepaymentNonPrimeStatus(
        userId,
        request.id,
      );

      this.logger.log(
        'Response status 201:',
        `${PaymentController.name}#makePayment`,
        request.id,
      );
    } catch (error) {
      // Will only move the user forward in the application process when the down-payment goes through
      await this.screenTrackingRepository.update(
        { user: userId },
        {
          lastLevel: 'repayment',
        },
      );
      this.logger.error(
        'Error:',
        `${PaymentController.name}#makePayment`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @Get('application/getpaymentschedule/:token')
  async getPayments(@Req() request: Request, @Param('token') token: string) {
    this.logger.log(
      'Request params:',
      `${PaymentController.name}#getPayments`,
      request.id,
    );

    try {
      const stats = await this.paymentService.getPaymentSchedule(
        request,
        token,
      );

      this.logger.log(
        'Return data:',
        `${PaymentController.name}#getPayments`,
        request.id,
        stats,
      );

      return stats;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentController.name}#getPayments`,
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
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(204)
  @Post('application/partialreturn')
  async partialReturnDetails(
    @Req() request: Request & { user: AdminJwtPayload },
    @Body('email') email: string,
    @Body('amount') amount: number,
  ) {
    try {
      await this.paymentService.partialReturnData(request, email, amount);
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentController.name}#partialReturnDetails`,
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
  @Post('application/refundPayment')
  async refundPayment(@Body('token') token: string, @Req() request: Request) {
    try {
      await this.paymentService.refundPaymentData(request, token);
      this.logger.log(
        'Response status 201:',
        `${PaymentController.name}#refundPayment`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentController.name}#refundPayment`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: PreviewPaymentResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard)
  @Post('application/dashboard/previewPayment')
  async previewPayment(
    @Body(new MakePaymentDialogPipe()) makePaymentDto: MakePaymentDialogDto,
    @Req() request: Request,
  ) {
    try {
      const { screenTracking } = request.user;
      const response = await this.paymentService.makePaymentRenderDialog(
        screenTracking,
        makePaymentDto,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${PaymentController.name}#previewPayment`,
        request.id,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentController.name}#previewPayment`,
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
  @Post('application/dashboard/submitPayment')
  async submitPayment(
    @Body(new MakePaymentDialogPipe()) submitPaymentDto: SubmitPaymentDto,
    @Req() request: Request,
  ) {
    const { screenTracking, role } = request.user;
    try {
      const response = await this.paymentService.submitPayment(
        screenTracking,
        submitPaymentDto,
        request.id,
      );

      const user: User = response.user as User;
      if (response) {
        await this.logActivityService.createLogActivityUpdateUser(
          request,
          logActivityModuleNames.PAYMENT_SCHEDULE,
          `${user.email} - ${user.role} Made payment with amount ${response.amount}. Payment reference ${response.paymentReference}. Payment id ${response.id}`,
          {
            id: user.id,
            email: user.email,
            role,
            userName: user.firstName + user.lastName,
            screenTracking,
            paymentId: response.id,
            paymentManagementId: response.paymentManagement as string,
            paymentStatus: response.status,
            merchantId: response.merchant as string,
          },
          screenTracking,
          user.id,
        );
      } else {
        await this.logActivityService.createLogActivityUpdateUser(
          request,
          logActivityModuleNames.PAYMENT_SCHEDULE,
          `${user.email} - ${user.role} Scheduled payment for ${moment(
            submitPaymentDto.paymentDate,
          ).format('MM/DD/YYYY')} with amount ${submitPaymentDto.amount}`,
          {
            id: user.id,
            email: user.email,
            role,
            userName: user.firstName + user.lastName,
            screenTracking,
          },
          screenTracking,
          user.id,
        );
      }

      this.logger.log(
        'Response status 201',
        `${PaymentController.name}#submitPayment`,
        request.id,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentController.name}#submitPayment`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Patch('application/dashboard/enableAutopay')
  async enableAutopay(
    @Body() enableAutopayDto: EnableAutopayDto,
    @Req() request: Request,
  ) {
    const paymentManagementId = enableAutopayDto.paymentManagementId;
    try {
      await this.paymentService.enableAutopay(paymentManagementId);
      const userInfo = request.user;
      await this.logActivityService.createLogActivityUpdateUser(
        request,
        logActivityModuleNames.ACCOUNTS,
        `${userInfo.email} - ${userInfo.role} enabled Auto Payment`,
        {
          id: userInfo.id,
          email: userInfo.email,
          role: userInfo.role,
          userName: userInfo.firstName + userInfo.lastName,
          screenTrackingId: userInfo.screenTracking,
        },
        userInfo.screenTracking,
        userInfo.id,
      );

      this.logger.log(
        'Response status 200',
        `${PaymentController.name}#enableAutopay`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentController.name}#enableAutopay`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: PreviewPaymentResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Post('admin/dashboard/loans/previewPayment/:screenTrackingId')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async adminPreviewPayment(
    @Param('screenTrackingId') screenTrackingId: string,
    @Body(new MakePaymentDialogPipe()) makePaymentDto: MakePaymentDialogDto,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      screenTrackingId;
      const response = await this.paymentService.makePaymentRenderDialog(
        screenTrackingId,
        makePaymentDto,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${PaymentController.name}#adminPreviewPayment`,
        request.id,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentController.name}#adminPreviewPayment`,
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
  @Post('admin/dashboard/loans/submitPayment/:screenTrackingId')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async adminSubmitPayment(
    @Param('screenTrackingId') screenTrackingId: string,
    @Body(new MakePaymentDialogPipe()) submitPaymentDto: SubmitPaymentDto,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      const response = await this.paymentService.submitPayment(
        screenTrackingId,
        submitPaymentDto,
        request.id,
      );

      const { id, userName, email, role, merchant } = request.user;
      if (response) {
        await this.logActivityService.createLogActivity(
          request,
          logActivityModuleNames.PAYMENT_SCHEDULE,
          `${request.user.email} - ${role} Made payment with amount ${response.amount}. Payment reference ${response.paymentReference}. Payment id ${response.id}`,
          {
            id,
            email,
            role,
            userName,
            merchantId: merchant,
            screenTrackingId,
            paymentId: response.id,
            paymentManagementId: response.paymentManagement as string,
            paymentStatus: response.status,
            customermerchantId: response.merchant as string,
          },
          undefined,
          response.paymentManagement as string,
          screenTrackingId,
        );
      } else {
        await this.logActivityService.createLogActivity(
          request,
          logActivityModuleNames.PAYMENT_SCHEDULE,
          `${request.user.email} - ${role} Scheduled payment for ${moment(
            submitPaymentDto.paymentDate,
          ).format('MM/DD/YYYY')} with amount ${submitPaymentDto.amount}`,
          {
            id,
            email,
            role,
            userName,
            adminmerchantId: merchant,
            screenTrackingId,
          },
          undefined,
          undefined,
          screenTrackingId,
        );
      }

      this.logger.log(
        'Response status 201',
        `${PaymentController.name}#adminSubmitPayment`,
        request.id,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentController.name}#adminSubmitPayment`,
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
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('admin/dashboard/loans/amendPayment/:screenTrackingId')
  async amendPayment(
    @Param('screenTrackingId') screenTrackingId: string,
    @Body(new MakePaymentDialogPipe()) submitPaymentDto: SubmitPaymentDto,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    // TODO fix this
    // const { screenTracking } = request.user;
    // try {
    //   const response = await this.paymentService.amendPayment(
    //     screenTracking,
    //     submitPaymentDto,
    //     request.id,
    //   );
    //   const { id, userName, email, role, merchant } = request.user;
    //   if (response) {
    //     await this.logActivityService.createLogActivity(
    //       request,
    //       logActivityModuleNames.PAYMENT_SCHEDULE,
    //       `${request.user.email} - ${role} Made Amendpayment with amount ${response.amount}. Payment reference ${response.paymentReference}. Payment id ${response.id}`,
    //       {
    //         id,
    //         email,
    //         role,
    //         userName,
    //         adminmerchantId: merchant,
    //         screenTrackingId,
    //         paymentId: response.id,
    //         paymentManagementId: response.paymentManagement as string,
    //         paymentStatus: response.status,
    //         customermerchantId: response.merchant as string,
    //       },
    //       undefined,
    //       response.paymentManagement as string,
    //       screenTrackingId,
    //     );
    //   } else {
    //     await this.logActivityService.createLogActivity(
    //       request,
    //       logActivityModuleNames.PAYMENT_SCHEDULE,
    //       `${request.user.email} - ${role} Scheduled payment for ${moment(
    //         submitPaymentDto.paymentDate,
    //       ).format('MM/DD/YYYY')} with amount ${submitPaymentDto.amount}`,
    //       {
    //         id,
    //         email,
    //         role,
    //         userName,
    //         adminmerchantId: merchant,
    //         screenTrackingId,
    //       },
    //       undefined,
    //       undefined,
    //       screenTrackingId,
    //     );
    //   }
    //   this.logger.log(
    //     'Response status 201',
    //     `${PaymentController.name}#amendPayment`,
    //     request.id,
    //   );
    //   return response;
    // } catch (error) {
    //   this.logger.error(
    //     'Error:',
    //     `${PaymentController.name}#amendPayment`,
    //     request.id,
    //     error,
    //   );
    //   throw error;
    // }
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(204)
  @Patch('admin/dashboard/loans/toggleAutopay/:paymentManagementId')
  async toggleAutopay(
    @Param('paymentManagementId') paymentManagementId: string,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      await this.paymentService.triggerAutoPay(paymentManagementId);
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentController.name}#updateLoanPaymentProCard`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @HttpCode(204)
  @Post('admin/dashboard/loans/forgivePayment/:screenTrackingId')
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async forgivePayment(
    @Param('screenTrackingId') screenTrackingId: string,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      await this.paymentService.forgivePayment(screenTrackingId, request.id);
      this.logger.log(
        'Response status 204',
        `${PaymentController.name}#forgivePayment`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentController.name}#forgivePayment`,
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
  @Post('admin/dashboard/loans/forgiveLateFee/:screenTrackingId')
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async forgiveLateFee(
    @Param('screenTrackingId') screenTrackingId: string,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      const response = await this.paymentService.forgiveLateFee(
        screenTrackingId,
        request.id,
      );

      const { id, userName, email, role, merchant } = request.user;
      await this.logActivityService.createLogActivity(
        request,
        logActivityModuleNames.PAYMENT_SCHEDULE,
        `${request.user.email} - ${role} Forgive late fees for user.`,
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
        'Response status 201',
        `${PaymentController.name}#forgiveLateFee`,
        request.id,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentController.name}#forgiveLateFee`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PaymentManagement })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Post('admin/dashboard/loans/deferPayment/:screenTrackingId')
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deferPayment(
    @Param('screenTrackingId') screenTrackingId: string,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      const response = await this.paymentService.deferPayment(
        screenTrackingId,
        request.id,
      );

      const { id, userName, email, role, merchant } = request.user;
      await this.logActivityService.createLogActivity(
        request,
        logActivityModuleNames.PAYMENT_SCHEDULE,
        `${request.user.email} - ${role} Defered next available payment.`,
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
        'Response status 201',
        `${PaymentController.name}#forgiveLateFee`,
        request.id,
      );
      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${PaymentController.name}#forgiveLateFee`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
