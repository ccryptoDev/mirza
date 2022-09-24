import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentManagement } from '../../payment-management/entities/payment-management.entity';
import { LoggerService } from '../../../../logger/services/logger.service';
import { ScreenTracking } from '../../../../user/screen-tracking/entities/screen-tracking.entity';
import { Accounts } from '../../../../user/accounts/entities/accounts.entity';

@Injectable()
export class LoanpaymentproService {
  constructor(
    @InjectRepository(PaymentManagement)
    private readonly paymentManagementRepository: Repository<PaymentManagement>,
    @InjectRepository(ScreenTracking)
    private readonly screenTrackingRepository: Repository<ScreenTracking>,
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  // async v21PaymentsRefundCard(
  //   transactionId: string,
  //   InvoiceId: string,
  //   Amount: string,
  //   requestId: string,
  // ) {
  //   this.logger.log(
  //     'Refund payment with arguments',
  //     `${LoanpaymentproService.name}#v21PaymentsRefundCard`,
  //     requestId,
  //     { transactionId, InvoiceId, Amount },
  //   );

  //   const apiUrl = this.configService.get<string>('v2BaseUrl');
  //   const acquiringKey = this.configService.get<string>('acquiringKey');
  //   const options: AxiosRequestConfig = {
  //     method: 'POST',
  //     url: `${apiUrl}/payments/${transactionId}/refund`,
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       TransactionKey: acquiringKey,
  //     },
  //     data: {
  //       Amount: Amount,
  //       InvoiceId: InvoiceId,
  //     },
  //   };

  //   const { data } = await axios(options);

  //   return data;
  // }

  // async v21PaymentsReturnRun(
  //   user: string,
  //   paymentMethodToken: string,
  //   amount: number,
  //   requestId: string,
  // ) {
  //   this.logger.log(
  //     'Making payment with arguments',
  //     `${LoanpaymentproService.name}#v21PaymentsReturnRun`,
  //     requestId,
  //     { user, paymentMethodToken },
  //   );
  //   const paymentManagement: PaymentManagement =
  //     await this.paymentManagementRepository.findOne({
  //       user,
  //     });
  //   if (!paymentManagement) {
  //     const errorMessage = `Payment management not found for user id ${user}`;
  //     throw new NotFoundException(undefined, errorMessage);
  //   }
  //   const cardDetails: LoanPaymentProCardToken =
  //     await this.loanPaymentProCardTokenRepository.findOne({
  //       user,
  //       paymentMethodToken,
  //     });
  //   if (!cardDetails) {
  //     const errorMessage = `Card token not found for user ${user}`;
  //     throw new NotFoundException(undefined, errorMessage);
  //   }

  //   const apiUrl = this.configService.get<string>('v2BaseUrl');
  //   const acquiringKey = this.configService.get<string>('acquiringKey');

  //   const options: AxiosRequestConfig = {
  //     method: 'POST',
  //     url: `${apiUrl}/payments/paymentcards/${cardDetails.paymentMethodToken}/disburse`,
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       TransactionKey: acquiringKey,
  //     },
  //     data: {
  //       Amount: '' + amount,
  //     },
  //   };

  //   const { status } = await axios(options);

  //   return status;
  // }
}
