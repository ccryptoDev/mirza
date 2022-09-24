import { Injectable } from '@nestjs/common';
import moment from 'moment';

import { LoggerService } from '../../../logger/services/logger.service';
import { PaymentManagement } from '../../payments/payment-management/entities/payment-management.entity';
import { IPaymentScheduleItem } from '../../payments/payment-management/interfaces/payment-schedule-item.interface';
import { ILedger } from '../interfaces/ledger.interface';

@Injectable()
export class LedgerService {
  constructor(private readonly logger: LoggerService) {}
  pendingPayments: number;
  paymentManagement1: PaymentManagement;

  getEmptyLedger(): ILedger {
    return {
      accruedFeesBalance: 0,
      accruedInterestBalance: 0,
      cycleAccruedInterest: 0,
      cycleEndDate: undefined,
      cyclePaidInterestBalance: 0,
      cyclePaidPrincipalBalance: 0,
      cyclePaymentBalance: 0,
      cyclePrincipalBalance: 0,
      cycleStartDate: undefined,
      dailyInterest: 0,
      daysInCycle: 0,
      daysPastDue: 0,
      ledgerDate: undefined,
      loanStartDate: undefined,
      paidFeesBalance: 0,
      paidInterestBalance: 0,
      paidPastDueInterestBalance: 0,
      paidPrincipalBalance: 0,
      pastDueInterestBalance: 0,
      paymentBalance: 0,
      payoff: 0,
      payoffWithNoFees: 0,
      principalBalance: 0,
      unpaidInterestBalance: 0,
    };
  }

  getPaymentLedger(
    paymentManagement: PaymentManagement,
    ledgerDate: Date,
    requestId: string,
  ): ILedger {
    const { payOffAmount, principalAmount } = paymentManagement;
    const { paymentSchedule } = paymentManagement;
    this.pendingPayments = 0;
    this.paymentManagement1 = paymentManagement;
    let ledger: ILedger = this.getEmptyLedger();
    ledger.ledgerDate = moment(ledgerDate).startOf('day').toDate();
    ledger.loanStartDate = moment(paymentManagement.loanStartDate)
      .startOf('day')
      .toDate();
    ledger.principalBalance = principalAmount;
    ledger.payoff = payOffAmount;
    ledger.payoffWithNoFees = this.toFixed(
      ledger.payoff - ledger.unpaidInterestBalance,
      2,
    );
    ledger.dailyInterest = paymentManagement.interestApplied / 365;
    let num = 0;

    paymentSchedule.forEach((scheduleItem) => {
      const isPastDue =
        moment(ledgerDate).isAfter(
          moment(scheduleItem.date).startOf('day'),
          'day',
        ) && scheduleItem.status === 'opened';
      if (isPastDue) {
        if (
          moment(scheduleItem.date).isSameOrBefore(
            moment(paymentManagement.nextPaymentSchedule),
            'month',
          )
        ) {
          num = 10;
        }
      }
    });

    paymentSchedule.forEach((scheduleItem) => {
      if (
        moment(scheduleItem.date).isBefore(
          moment(paymentManagement.nextPaymentSchedule),
          'month',
        )
      ) {
        this.resetPeriodAmounts(ledger);
      }

      const isEarlyPayment =
        moment(ledger.ledgerDate).isSameOrBefore(
          moment(paymentManagement.nextPaymentSchedule),
          'day',
        ) &&
        moment(scheduleItem.date).isSameOrBefore(
          moment(paymentManagement.nextPaymentSchedule),
          'day',
        ) &&
        scheduleItem.status === 'opened';
      const isPastDue =
        moment(ledgerDate).isAfter(
          moment(scheduleItem.date).startOf('day'),
          'day',
        ) && scheduleItem.status === 'opened';
      const isPaid = scheduleItem.status === 'paid';

      if (isEarlyPayment) {
        ledger = this.handleEarlyPayment(ledger, scheduleItem);
      } else if (isPastDue) {
        ledger = this.handleOpenedPastDue(
          ledger,
          scheduleItem,
          num,
          paymentSchedule,
        );
      } else if (isPaid) {
        ledger = this.handlePaymentMade(ledger, scheduleItem);
      } else {
        // future payment

        if (scheduleItem.status === 'opened') {
          if (this.pendingPayments == 1) {
            this.pendingPayments = 0;
            //this.resetPeriodAmounts(ledger);
          }
        }

        return;
      }
    });

    ledger.payoff = this.toFixed(
      ledger.accruedFeesBalance +
        ledger.unpaidInterestBalance +
        ledger.cycleAccruedInterest +
        ledger.principalBalance,
      5,
    );

    ledger.payoffWithNoFees = this.toFixed(
      ledger.unpaidInterestBalance +
        ledger.cycleAccruedInterest +
        ledger.principalBalance,
      5,
    );

    this.logger.log(
      'Ledger response:',
      `${LedgerService.name}#getPaymentLedger`,
      requestId,
      ledger,
    );

    return ledger;
  }

  handlePaymentMade(
    ledger: ILedger,
    scheduleItem: IPaymentScheduleItem,
  ): ILedger {
    // payments made

    ledger.paymentBalance = this.toFixed(
      ledger.paymentBalance + scheduleItem.payment,
      5,
    );
    ledger.paidFeesBalance = this.toFixed(
      ledger.paidFeesBalance + scheduleItem.paidFees,
      5,
    );
    ledger.paidPastDueInterestBalance = this.toFixed(
      ledger.paidPastDueInterestBalance + scheduleItem.paidPastDueInterest,
      5,
    );
    ledger.paidInterestBalance = this.toFixed(
      ledger.paidInterestBalance + scheduleItem.paidInterest,
      5,
    );
    ledger.paidPrincipalBalance = this.toFixed(
      ledger.paidPrincipalBalance + scheduleItem.paidPrincipal,
      5,
    );

    // accrued balances
    ledger.accruedFeesBalance = this.toFixed(
      ledger.accruedFeesBalance + scheduleItem.fees,
      5,
    );
    ledger.pastDueInterestBalance = this.toFixed(
      ledger.pastDueInterestBalance + scheduleItem.pastDueInterest,
      5,
    );
    ledger.accruedInterestBalance = this.toFixed(
      ledger.accruedInterestBalance + scheduleItem.interest,
      5,
    );
    ledger.principalBalance = this.toFixed(
      ledger.principalBalance - scheduleItem.paidPrincipal,
      5,
    );

    // unpaid balances
    ledger.accruedFeesBalance = this.toFixed(
      ledger.accruedFeesBalance - ledger.paidFeesBalance,
      5,
    );
    ledger.unpaidInterestBalance = this.toFixed(
      ledger.pastDueInterestBalance - ledger.paidPastDueInterestBalance,
      5,
    );

    return ledger;
  }

  handleEarlyPayment(
    ledger: ILedger,
    scheduleItem: IPaymentScheduleItem,
  ): ILedger {
    ledger.cycleStartDate = moment(scheduleItem.date)
      .subtract(1, 'month')
      .startOf('day')
      .toDate();
    ledger.cycleEndDate = moment(scheduleItem.date).startOf('day').toDate();
    ledger.daysInCycle = moment(ledger.ledgerDate)
      .startOf('day')
      .diff(moment(ledger.loanStartDate), 'days');

    // accrued balances
    ledger.cycleAccruedInterest =
      ledger.daysInCycle <= 0
        ? 0
        : this.toFixed(
            (ledger.dailyInterest *
              ledger.daysInCycle *
              ledger.principalBalance) /
              100,
            5,
          );

    ledger.accruedInterestBalance = this.toFixed(
      ledger.accruedInterestBalance + ledger.cycleAccruedInterest,
      5,
    );

    return ledger;
  }

  handleOpenedPastDue(
    ledger: ILedger,
    scheduleItem: IPaymentScheduleItem,
    index: number,
    paySchedule: IPaymentScheduleItem[],
  ): ILedger {
    // accrued interest

    if (
      moment(scheduleItem.date).isBefore(
        moment(this.paymentManagement1.nextPaymentSchedule),
        'month',
      )
    ) {
    }
    //ledger.principalBalance = ledger.principalBalance - scheduleItem.principal;
    ledger.cycleStartDate = moment(scheduleItem.date)
      .subtract('1', 'month')
      .startOf('day')
      .toDate();

    ledger.cycleEndDate = moment(scheduleItem.date).startOf('day').toDate();

    ledger.daysInCycle = moment(ledger.cycleEndDate)
      .startOf('day')
      .diff(moment(ledger.cycleStartDate), 'days');

    ledger.cycleAccruedInterest = this.toFixed(
      (ledger.dailyInterest * ledger.daysInCycle * ledger.principalBalance) /
        100,
      5,
    );

    ledger.accruedInterestBalance = this.toFixed(
      ledger.accruedInterestBalance + ledger.cycleAccruedInterest,
      5,
    );

    //if (this.pendingPayments == 0) {
    // past due interest
    const daysPastDue = moment(ledger.ledgerDate)
      .startOf('day')
      .diff(moment(scheduleItem.date).startOf('day'), 'days');

    ledger.daysPastDue = daysPastDue;

    const pastDueInterest =
      (ledger.dailyInterest * daysPastDue * ledger.principalBalance) / 100;
    ledger.pastDueInterestBalance = this.toFixed(
      ledger.pastDueInterestBalance + pastDueInterest,
      5,
    );

    ledger.unpaidInterestBalance = this.toFixed(
      ledger.unpaidInterestBalance + pastDueInterest,
      5,
    );

    return ledger;
  }

  resetPeriodAmounts(ledger: ILedger): ILedger {
    ledger.cyclePaymentBalance = 0;
    ledger.cycleAccruedInterest = 0;
    ledger.cyclePaidInterestBalance = 0;
    ledger.cyclePaidPrincipalBalance = 0;
    ledger.cyclePrincipalBalance = 0;
    ledger.daysInCycle = 0;

    return ledger;
  }

  toFixed(number: number, precision: number) {
    return parseFloat(number.toFixed(precision));
  }
}
