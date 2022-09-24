import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { LoggerService } from '../../logger/services/logger.service';
import { Counters } from '../entities/counters.entity';
import { PaymentManagement } from '../../loan/payments/payment-management/entities/payment-management.entity';
import { Role } from '../../authentication/roles/role.enum';

@Injectable()
export class CountersService {
  constructor(
    @InjectRepository(Counters)
    private readonly applicationReferenceRepository: Repository<Counters>,
    @InjectRepository(PaymentManagement)
    private readonly paymentManagementRepository: Repository<PaymentManagement>,
    private readonly logger: LoggerService,
  ) {}

  async getNextSequenceValue(sequenceName: string, requestId: string) {
    this.logger.log(
      'Generating next sequence value with arguments',
      `${CountersService.name}#getNextSequenceValue`,
      requestId,
      { sequenceName },
    );

    const existingCounter = await this.applicationReferenceRepository.findOne({
      where: { appType: sequenceName },
    });

    let result: Counters;
    if (!existingCounter) {
      const newCounter = this.applicationReferenceRepository.create({
        appType: sequenceName,
        sequenceValue: '1',
      });
      await this.applicationReferenceRepository.save(newCounter);

      result = newCounter;
    } else {
      existingCounter.sequenceValue = +existingCounter.sequenceValue + 1 + '';
      await this.applicationReferenceRepository.save(existingCounter);

      result = existingCounter;
    }

    this.logger.log(
      'Next sequence value generated',
      `${CountersService.name}#getNextSequenceValue`,
      requestId,
      result,
    );

    return result;
  }

  async getLoanCounters(role: string, merchant: string, requestId: string) {
    this.logger.log(
      'Getting loan counters:',
      `${CountersService.name}#getLoanCounters`,
      requestId,
    );

    const approvedAndPendingMatchingCriteria =
      role === Role.Merchant
        ? {
            status: In(['approved', 'pending']),
            merchant,
          }
        : {
            status: In(['approved', 'pending']),
          };
    const repaymentPrimeAndNonPrimeMatchingCriteria =
      role === Role.Merchant
        ? {
            status: In(['in-repayment prime', 'in-repayment non-prime']),
            merchant,
          }
        : {
            status: In(['in-repayment prime', 'in-repayment non-prime']),
          };
    const expiredMatchingCriteria =
      role === Role.Merchant
        ? {
            status: 'expired',
            merchant,
          }
        : {
            status: 'expired',
          };
    let requestFundsMatchingCriteria: undefined | Record<string, any> =
      undefined;
    if (role === Role.Merchant) {
      requestFundsMatchingCriteria = {
        status: 'request-funds',
        merchant,
      };
    }
    let sendFundsMatchingCriteria: undefined | Record<string, any> = undefined;
    if (role === Role.SuperAdmin) {
      sendFundsMatchingCriteria = {
        status: 'send-funds',
      };
    }
    const promisesArray = [
      this.paymentManagementRepository.count({
        where: approvedAndPendingMatchingCriteria,
      }),
      this.paymentManagementRepository.count({
        where: repaymentPrimeAndNonPrimeMatchingCriteria,
      }),
      this.paymentManagementRepository.count({
        where: expiredMatchingCriteria,
      }),
    ];
    if (requestFundsMatchingCriteria) {
      promisesArray.push(
        this.paymentManagementRepository.count({
          where: requestFundsMatchingCriteria,
        }),
      );
    }
    if (sendFundsMatchingCriteria) {
      promisesArray.push(
        this.paymentManagementRepository.count({
          where: sendFundsMatchingCriteria,
        }),
      );
    }

    const result = await Promise.all(promisesArray);
    const response = {
      opportunities: result[0],
      inRepayment: result[1],
      expired: result[2],
      ...(role === Role.Merchant && { requestFunds: result[3] }),
      ...(role === Role.SuperAdmin && { sendFunds: result[3] }),
    };

    this.logger.log(
      'Got loan counters:',
      `${CountersService.name}#getLoanCounters`,
      requestId,
      response,
    );

    return response;
  }
}
