import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { Repository, In } from 'typeorm';

import { LoggerService } from '../../../logger/services/logger.service';
import { User } from '../../entities/user.entity';
import { PaymentManagement } from '../../../loan/payments/payment-management/entities/payment-management.entity';
import { IPaymentScheduleItem } from '../../../loan/payments/payment-management/interfaces/payment-schedule-item.interface';
import { IPaymentScheduleStatusItem } from '../../../loan/payments/payment-management/interfaces/payment-schedule-transactionstatus.interface';
import { Payment } from '../entities/payment.entity';
import { PaymentService } from './payment.service';

@Injectable()
export class PaymentCronService {
  constructor(
    @InjectRepository(PaymentManagement)
    private readonly paymentManagementRepository: Repository<PaymentManagement>,
    private readonly paymentService: PaymentService,
    private readonly logger: LoggerService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async makeAutomaticPayment() {
    // TODO fix this
    // this.logger.log(
    //   'Running automatic payment cron',
    //   `${PaymentService.name}#makeAutomaticPayment`,
    // );
    // let paymentManagementId = '';
    // let scheduleItemIndex = 0;
    // let paymentSchedule: IPaymentScheduleItem[];
    // try {
    //   // check for payments due today
    //   const today: Date = moment().startOf('day').toDate();
    //   const paymentManagements: PaymentManagement[] | null =
    //     await this.paymentManagementRepository.find({
    //       where: {
    //         status: In(['in-repayment prime', 'in-repayment non-prime']),
    //         canRunAutomaticPayment: true,
    //       },
    //     });
    //   if (!paymentManagements || paymentManagements.length <= 0) {
    //     this.logger.log(
    //       'No active loans found',
    //       `${PaymentService.name}#makeAutomaticPayment`,
    //     );
    //     return;
    //   }
    //   for (const paymentManagement of paymentManagements) {
    //     try {
    //       // get default card token
    //       paymentManagementId = paymentManagement.id;
    //       const user = paymentManagement.user as User;
    //       let cardToken = await this.loanPaymentProCardTokenRepository.findOne({
    //         user,
    //         isDefaultPaymentMethod: true,
    //       });
    //       if (!cardToken) {
    //         cardToken = await this.loanPaymentProCardTokenRepository.findOne({
    //           user,
    //         });
    //         if (!cardToken) {
    //           this.logger.error(
    //             `Payment method token for user id ${user.id} not found`,
    //             `${PaymentService.name}#makeAutomaticPayment`,
    //           );
    //           continue;
    //         }
    //       }
    //       // find schedule items
    //       const paymentScheduleItems: IPaymentScheduleItem[] =
    //         paymentManagement.paymentSchedule.filter(
    //           (scheduleItem) =>
    //             moment(scheduleItem.date).startOf('day').isSame(today) &&
    //             scheduleItem.status === 'opened',
    //         );
    //       if (!paymentScheduleItems || paymentScheduleItems.length <= 0) {
    //         continue;
    //       }
    //       this.logger.log(
    //         `Processing automatic payment for payment management id ${paymentManagementId}`,
    //         `${PaymentService.name}#makeAutomaticPayment`,
    //       );
    //       paymentSchedule = paymentManagement.paymentSchedule;
    //       for (const paymentScheduleItem of paymentScheduleItems) {
    //         scheduleItemIndex = paymentSchedule.findIndex(
    //           (scheduleItem) =>
    //             scheduleItem.transactionId ===
    //             paymentScheduleItem.transactionId,
    //         );
    //         // make payment
    //         const paymentAmount = paymentScheduleItem.month
    //           ? paymentManagement.currentPaymentAmount
    //           : paymentScheduleItem.amount;
    //         const payment: Payment = await this.paymentService.makePayment(
    //           paymentManagement,
    //           cardToken.paymentMethodToken,
    //           paymentAmount,
    //         );
    //         paymentScheduleItem.payment = paymentAmount;
    //         paymentScheduleItem.paidInterest = paymentScheduleItem.interest;
    //         paymentScheduleItem.paidPrincipal = paymentScheduleItem.principal;
    //         paymentScheduleItem.status = 'paid';
    //         paymentScheduleItem.paymentType = 'automatic';
    //         paymentScheduleItem.paymentReference = payment.paymentReference;
    //         paymentScheduleItem.paymentDate = today;
    //         paymentScheduleItem.transactionMessage = payment.transactionMessage;
    //         paymentScheduleItem.transId = payment.transId;
    //         const updatedPaymentManagement = {
    //           paymentSchedule: paymentManagement.paymentSchedule,
    //           status:
    //             paymentManagement.payOffAmount <= 0
    //               ? 'paid'
    //               : paymentManagement.status,
    //           nextPaymentSchedule: today,
    //         };
    //         // find next payment date
    //         const nextPaymentScheduleItem: IPaymentScheduleItem =
    //           paymentManagement.paymentSchedule.find(
    //             (scheduleItem) => scheduleItem.status === 'opened',
    //           );
    //         if (nextPaymentScheduleItem) {
    //           updatedPaymentManagement.nextPaymentSchedule =
    //             nextPaymentScheduleItem.date;
    //         }
    //         await this.paymentManagementRepository.update(
    //           { id: paymentManagement.id },
    //           updatedPaymentManagement,
    //         );
    //         this.logger.log(
    //           `Automatic payment for payment management id ${paymentManagementId} processed successfully.`,
    //           `${PaymentService.name}#makeAutomaticPayment`,
    //         );
    //       }
    //     } catch (error) {
    //       this.logger.error(
    //         `Could not process automatic payment for payment management id ${paymentManagementId}`,
    //         `${PaymentService.name}#makeAutomaticPayment`,
    //         undefined,
    //         error,
    //       );
    //       // add transaction status to payment schedule
    //       const transactionStatus: IPaymentScheduleStatusItem = {
    //         amount: paymentManagement.currentPaymentAmount,
    //         date: paymentManagement.paymentSchedule[scheduleItemIndex].date,
    //         transactionMessage: error.message,
    //         transId: error.transactionId,
    //       };
    //       const newPaymentTransactionstatus: IPaymentScheduleStatusItem[] = [];
    //       newPaymentTransactionstatus.push(transactionStatus);
    //       const updatedPaymentManagement = {
    //         paymentSchedule: paymentManagement.paymentSchedule,
    //       };
    //       // updatedPaymentManagement.paymentSchedule[
    //       //   scheduleItemIndex
    //       // ].transactionStatus = newPaymentTransactionstatus;
    //       await this.paymentManagementRepository.update(
    //         { id: paymentManagement.id },
    //         updatedPaymentManagement,
    //       );
    //       // add failed schedule item to payment schedule
    //       const failedScheduleItem: IPaymentScheduleItem = {
    //         ...paymentSchedule[scheduleItemIndex],
    //         status: 'failed',
    //         transactionMessage: error.message,
    //         transId: error.transactionId,
    //         date: today,
    //       };
    //       const newPaymentSchedule: IPaymentScheduleItem[] = [];
    //       paymentSchedule.forEach((scheduleItem) => {
    //         if (moment(scheduleItem.date).isBefore(today, 'day')) {
    //           newPaymentSchedule.push(scheduleItem);
    //         }
    //       });
    //       newPaymentSchedule.push(failedScheduleItem);
    //       let payIndex = 0;
    //       paymentSchedule.forEach(async (scheduleItem) => {
    //         payIndex = payIndex + 1;
    //         if (moment(scheduleItem.date).isSame(today, 'day')) {
    //           if (
    //             scheduleItem.status != 'failed' &&
    //             scheduleItem.status != 'paid'
    //           ) {
    //             if (!scheduleItem.transactionStatus) {
    //               scheduleItem.date = this.addDays(2, scheduleItem.date);
    //               scheduleItem.transactionStatus = newPaymentTransactionstatus;
    //             } else if (scheduleItem.transactionStatus.length >= 1) {
    //               // if (scheduleItem.transactionStatus.length >= 1) {
    //               scheduleItem.date = this.addDays(0, scheduleItem.date);
    //               // } else {
    //               //   scheduleItem.date = this.addDays(2, scheduleItem.date);
    //               // }
    //               scheduleItem.transactionStatus.push(transactionStatus);
    //               //if (scheduleItem.transactionStatus.length > 2) {
    //               newPaymentSchedule.push(scheduleItem);
    //               await this.paymentManagementRepository.update(
    //                 paymentManagementId,
    //                 {
    //                   canRunAutomaticPayment: false,
    //                 },
    //               );
    //               //}
    //             }
    //           }
    //         }
    //         if (moment(scheduleItem.date).isAfter(today, 'day')) {
    //           newPaymentSchedule.push(scheduleItem);
    //         }
    //       });
    //       await this.paymentManagementRepository.update(paymentManagementId, {
    //         paymentSchedule: newPaymentSchedule,
    //       });
    //     }
    //   }
    //   this.logger.log(
    //     'Ran automatic payment cron',
    //     `${PaymentService.name}#makeAutomaticPayment`,
    //   );
    // } catch (error) {
    //   this.logger.log(
    //     `Internal server error`,
    //     `${PaymentService.name}#makeAutomaticPayment`,
    //     undefined,
    //     error,
    //   );
    // }
  }

  addDays(days: number, dates: Date): Date {
    const futureDate = dates;
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate;
  }
}
