import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';

import { LogActivity } from '../entities/log-activity.entity';
import { CountersService } from '../../../counter/services/counters.service';
import { AdminJwtPayload } from '../../../authentication/types/jwt-payload.types';
import { LoggerService } from '../../../logger/services/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  getRepository,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';

export enum logActivityModuleNames {
  ACCOUNTS = 'Accounts',
  APPLICATION_LINK = 'Application Link',
  DOCUMENT_UPLOAD = 'Document Upload',
  LENDING_CENTER = 'Lending Center',
  LOAN_DETAILS = 'Loan Details',
  LOAN_SETTINGS = 'Loan Settings',
  LOGIN = 'Login',
  LOGOUT = 'Logout',
  MANAGE_APPLICANTS = 'Manage Applicants',
  MANAGE_MERCHANTS = 'Manage Merchants',
  MANAGE_USERS = 'Manage Users',
  OPPORTUNITIES = 'Opportunities',
  PAYMENT_SCHEDULE = 'Payment Schedule',
}

@Injectable()
export class LogActivityService {
  constructor(
    @InjectRepository(LogActivity)
    private readonly logActivityRepository: Repository<LogActivity>,
    private readonly CounterService: CountersService,
    private readonly logger: LoggerService,
  ) {}

  async createLogActivity(
    request: Request & { user: AdminJwtPayload },
    moduleName: string,
    message: string,
    data?: any,
    loanReference?: string,
    paymentManagementId?: string,
    screenTrackingId?: string,
  ) {
    this.logger.log(
      'Creating log activity with arguments',
      `${LogActivityService.name}#`,
      request.id,
      {
        user: request.user,
        moduleName,
        message,
        data,
        loanReference,
        paymentManagementId,
        screenTrackingId,
      },
    );
    const reference = await this.CounterService.getNextSequenceValue(
      'logs',
      request.id,
    );

    const logInfo = {
      userId: request.user.id,
      jsonData: data ? JSON.stringify(data, null, '  ') : undefined,
      email: request.user?.email,
      ip: request.connection.remoteAddress,
      message,
      loanReference,
      logReference: `LOG_${reference.sequenceValue}`,
      moduleName,
      name: request.user.userName,
      paymentManagementId,
      merchantId: request.user.merchant,
      requestUri: request.url,
      screenTrackingId: screenTrackingId,
    };

    let response: LogActivity = this.logActivityRepository.create(logInfo);
    response = await this.logActivityRepository.save(response);
    this.logger.log(
      'Log activity created:',
      `${LogActivityService.name}#createLogActivity`,
      request.id,
      response,
    );

    return { logActivityId: response.id };
  }

  async createLogActivityUpdateUser(
    request: any,
    moduleName: string,
    message: string,
    data?: any,
    screenTrackingId?: string,
    user?: any,
  ) {
    this.logger.log(
      'Creating log activity with arguments',
      `${LogActivityService.name}#`,
      request.id,
      {
        user: user,
        moduleName,
        message,
        data,
        screenTrackingId,
      },
    );
    const reference = await this.CounterService.getNextSequenceValue(
      'logs',
      request.id,
    );

    const logInfo = {
      userId: user.id,
      jsonData: data ? JSON.stringify(data, null, '  ') : undefined,
      email: user.email,
      ip: request.connection.remoteAddress,
      message,
      logReference: `LOG_${reference.sequenceValue}`,
      moduleName,
      name: user.userName,
      requestUri: request.url,
      merchantId: user.merchant,
      screenTrackingId: screenTrackingId,
    };

    let response: LogActivity = this.logActivityRepository.create(logInfo);
    response = await this.logActivityRepository.save(response);
    this.logger.log(
      'Log activity created:',
      `${LogActivityService.name}#createLogActivity`,
      request.id,
      response,
    );

    return { logActivityId: response.id };
  }

  async getAllLogActivities(
    queryParams: { page: number; perPage: number; search: string },
    requestId: string,
  ) {
    this.logger.log(
      'Getting all log activities with arguments',
      `${LogActivityService.name}#getAllLogActivities`,
      requestId,
      { getPaginatedLogActivitiesDto: queryParams },
    );
    const { page, perPage, search } = queryParams;
    const logActivityResponse: [LogActivity[], number] = await getRepository(
      LogActivity,
    )
      .createQueryBuilder('logActivity')
      .where(
        new Brackets((whereExpressionBuilder: WhereExpressionBuilder) => {
          if (search) {
            whereExpressionBuilder
              .where(`logActivity.loanReference ILIKE '%${search}%'`)
              .orWhere(`logActivity.logReference ILIKE '%${search}%'`)
              .orWhere(`logActivity.moduleName ILIKE '%${search}%'`)
              .orWhere(`logActivity.message ILIKE '%${search}%'`)
              .orWhere(`logActivity.ip ILIKE '%${search}%'`);
          }
        }),
      )
      .take(perPage)
      .skip((page - 1) * perPage)
      .orderBy('logActivity.createdAt', 'DESC')
      .getManyAndCount();

    const logs = logActivityResponse[0].map(
      ({
        id,
        createdAt,
        email,
        ip,
        loanReference,
        logReference,
        message,
        moduleName,
        screenTrackingId,
      }: any) => {
        return {
          id: id,
          createdDate: createdAt,
          email,
          ip,
          loanReference: loanReference ? loanReference : '--',
          logReference,
          message,
          moduleName,
          screenTrackingId,
        };
      },
    );
    const response = { items: logs, total: logActivityResponse[1] };
    this.logger.log(
      'Got log activities:',
      `${LogActivityService.name}#getAllLogActivities`,
      requestId,
      response,
    );

    return response;
  }

  async getLogActivityById(id: string, requestId: string) {
    this.logger.log(
      'Getting log activity with arguments',
      `${LogActivityService.name}#getAdminById`,
      requestId,
      { id },
    );
    const logActivity: LogActivity | null =
      await this.logActivityRepository.findOne(id);

    if (!logActivity) {
      const errorMessage = `Could not find log id ${id}`;
      this.logger.error(
        errorMessage,
        `${LogActivityService.name}#getLogActivityById`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    this.logger.log(
      'Got log activity:',
      `${LogActivityService.name}#getLogActivityById`,
      requestId,
      logActivity,
    );

    return logActivity;
  }

  async getLogActivitiesByScreenTrackingId(
    screenTrackingId: string,
    queryParams: { page: number; perPage: number; search: string },
    requestId: string,
  ) {
    this.logger.log(
      'Getting all log activities by screen tracking id with arguments',
      `${LogActivityService.name}#getLogActivitiesByScreenTrackingId`,
      requestId,
      { screenTrackingId, getPaginatedLogActivitiesDto: queryParams },
    );
    const { page, perPage, search } = queryParams;
    const logActivityResponse: [LogActivity[], number] = await getRepository(
      LogActivity,
    )
      .createQueryBuilder('logActivity')
      .where(
        new Brackets((whereExpressionBuilder: WhereExpressionBuilder) => {
          whereExpressionBuilder.where(
            'logActivity.screenTrackingId = :screenTrackingId',
            { screenTrackingId },
          );

          if (search) {
            whereExpressionBuilder.andWhere(
              new Brackets(
                (andWhereExpressionBuilder: WhereExpressionBuilder) => {
                  andWhereExpressionBuilder
                    .where(`logActivity.logReference ILIKE '%${search}%'`)
                    .orWhere(`logActivity.moduleName ILIKE '%${search}%'`)
                    .orWhere(`logActivity.message ILIKE '%${search}%'`);
                },
              ),
            );
          }
        }),
      )
      .take(perPage)
      .skip((page - 1) * perPage)
      .orderBy('logActivity.createdAt', 'DESC')
      .getManyAndCount();

    const logs = logActivityResponse[0].map(
      ({ createdAt, logReference, message, moduleName, id }: any) => {
        return {
          id,
          createdDate: createdAt,
          logReference,
          message,
          moduleName,
        };
      },
    );
    const response = { items: logs, total: logActivityResponse[1] };
    this.logger.log(
      'Got log activities by screen tracking id :',
      `${LogActivityService.name}#getLogActivitiesByScreenTrackingId`,
      requestId,
      response,
    );

    return response;
  }
}
