import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  HttpCode,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Request } from 'express';
import { User } from '../../entities/user.entity';
import { ApplyDto } from '../validation/apply.dto';
import { ApplyPipe } from '../validation/apply.pipe';
import { LoggerService } from '../../../logger/services/logger.service';
import { UserService } from '../../services/user.service';
import { CountersService } from '../../../counter/services/counters.service';
import { ScreenTrackingService } from '../../screen-tracking/services/screen-tracking.service';
import { ScreenTracking } from '../../screen-tracking/entities/screen-tracking.entity';
import { ApplicationService } from '../services/application.service';
import { JwtAuthGuard } from '../../../authentication/strategies/jwt-auth.guard';
import { ConsentService } from '../../consent/services/consent.service';
import { ApplyResponse } from '../types/applyResponse';
import { BadRequestResponse } from 'src/types/bad-request-response';
import { ErrorResponse } from 'src/types/error-response';
import { GetContractResponse } from '../types/get-contract-response';
import { GetAllLoansResponse } from '../types/get-all-loans-response';
import { Role } from '../../../authentication/roles/role.enum';
import { Roles } from '../../../authentication/roles/roles.decorator';
import { RolesGuard } from '../../../authentication/roles/guards/roles.guard';
import { PaymentManagement } from '../../../loan/payments/payment-management/entities/payment-management.entity';
import { AdminJwtPayload } from '../../../authentication/types/jwt-payload.types';
import { GetApplicationInfoResponse } from '../types/get-application-info-response';
import {
  LogActivityService,
  logActivityModuleNames,
} from '../../../admin/log-activity/services/log-activity.service';
import { Counters } from '../../../counter/entities/counters.entity';
import { PaymentManagementService } from '../../../loan/payments/payment-management/services/payment-management.service';
import { CreateConsentsDto } from '../validation/create-consents.dto';

@Controller('/api')
export class ApplicationController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    private readonly countersService: CountersService,
    private readonly applicationService: ApplicationService,
    private readonly consentService: ConsentService,
    private readonly logActivityService: LogActivityService,
    private readonly paymentManagementService: PaymentManagementService,
    private readonly screenTrackingService: ScreenTrackingService,
  ) {}

  @ApiCreatedResponse({ type: ApplyResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Post('application/apply')
  async apply(
    @Body(new ApplyPipe()) applyDto: ApplyDto,
    @Req() request: Request,
  ) {
    try {
      const user: User = await this.userService.createNewUser(
        applyDto,
        request.id,
      );

      const applicationReferenceData: Counters =
        await this.countersService.getNextSequenceValue(
          'application',
          request.id,
        );
      const applicationReference = `APL_${applicationReferenceData.sequenceValue}`;
      const isBackendApplication: boolean = applyDto.isBackendApplication
        ? true
        : false;
      const screenTracking: ScreenTracking =
        await this.screenTrackingService.createNewScreenTracking(
          user,
          applicationReference,
          isBackendApplication,
          request.id,
        );
      user.screenTracking = screenTracking.id;
      await this.userRepository.save(user);

      await this.paymentManagementService.createPaymentManagement(
        screenTracking,
        'approved',
        request.id,
      );

      this.logger.log(
        'Response status 201',
        `${ApplicationController.name}#apply`,
        request.id,
        { userId: user.id, screenTrackingId: screenTracking.id },
      );

      return {
        userId: user.id,
        screenTrackingId: user.screenTracking,
        referenceNumber: user.userReference,
      };
    } catch (error) {
      this.logger.error(
        'Error:',
        `${ApplicationController.name}#apply`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @ApiBearerAuth()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Post('application/consents')
  async createConsents(
    @Body() createConsentsDto: CreateConsentsDto,
    @Req() request: Request,
  ) {
    const { screenTracking } = request.user;
    try {
      await this.consentService.createApplicationConsents(
        screenTracking,
        createConsentsDto,
        request,
      );

      this.logger.log(
        'Response status 204',
        `${ApplicationController.name}#createConsents`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error',
        `${ApplicationController.name}#createConsents`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @ApiBearerAuth()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Post('application/finalize')
  async finalize(@Req() request: Request) {
    const { screenTracking, id } = request.user;
    try {
      await this.applicationService.createLoan(screenTracking, id, request.id);
      await this.applicationService.generateRIC(screenTracking, id, request);
      await this.applicationService.connectUserConsentsToPM(
        screenTracking,
        id,
        request.id,
      );

      this.logger.log(
        'Response status 201',
        `${ApplicationController.name}#finalize`,
        request.id,
      );
    } catch (error) {
      this.logger.error(
        'Error',
        `${ApplicationController.name}#finalize`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: GetContractResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @UseGuards(JwtAuthGuard)
  @Get('application/contract')
  async getContractData(@Req() request: Request) {
    const screenTrackingId = request.user.screenTracking;

    try {
      const response = await this.applicationService.getPromissoryNoteData(
        screenTrackingId,
        request,
      );
      this.logger.log(
        'Response status 200',
        `${ApplicationController.name}#getContractData`,
        request.id,
        response,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${ApplicationController.name}#getContractData`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('application/efta')
  async generateEFTA(@Req() request: Request) {
    const id = request.user.id;
    try {
      const response = await this.consentService.createEFTAAgreement(
        id,
        request,
      );

      this.logger.log(
        'Response status 201',
        `${ApplicationController.name}#generateEFTA`,
        request.id,
      );

      return { documentId: response };
    } catch (error) {
      this.logger.error(
        'Error',
        `${ApplicationController.name}#generateEFTA`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiOkResponse({ type: GetAllLoansResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Get('admin/dashboard/loans')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getApplications(
    @Query('status')
    status: PaymentManagement['status'],
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(25), ParseIntPipe) perPage: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Req() request: Request & { user: AdminJwtPayload },
  ) {
    try {
      const { role, merchant } = request.user;
      const applications = await this.applicationService.getApplicationByStatus(
        role,
        merchant,
        status,
        page,
        perPage,
        search,
        request.id,
      );

      this.logger.log(
        'Response status 200',
        `${ApplicationController.name}#getApplications`,
        request.id,
      );

      return applications;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${ApplicationController.name}#getApplications`,
        request.id,
        error,
      );
      throw error;
    }
  }

  @ApiOkResponse({ type: GetApplicationInfoResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ type: ErrorResponse })
  @Get('admin/dashboard/application/info/:screenTrackingId')
  @Roles(Role.SuperAdmin, Role.Manager, Role.MerchantStaff, Role.Merchant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getApplicationInfo(
    @Req() request: Request & { user: AdminJwtPayload },
    @Param('screenTrackingId') screenTrackingId: string,
  ) {
    this.logger.log(
      'Request params:',
      `${ApplicationController.name}#getApplicationInfo`,
      request.id,
    );

    try {
      const response = await this.applicationService.getApplicationInfo(
        screenTrackingId,
        request.id,
      );
      const { id, userName, email, role, merchant } = request.user;
      await this.logActivityService.createLogActivity(
        request,
        logActivityModuleNames.LOAN_DETAILS,
        `${request.user.email} - ${role} Viewing loan details`,
        {
          id,
          email,
          role,
          userName,
          merchantId: merchant,
          screenTrackingId,
        },
        response.financingReferenceNumber,
        undefined,
        screenTrackingId,
      );

      this.logger.log(
        'Response status 200',
        `${ApplicationController.name}#getApplicationInfo`,
        request.id,
      );

      return response;
    } catch (error) {
      this.logger.error(
        'Error:',
        `${ApplicationController.name}#getApplicationInfo`,
        request.id,
        error,
      );
      throw error;
    }
  }
}
