import { Injectable } from '@nestjs/common';

import { LoggerService } from '../../../logger/services/logger.service';

@Injectable()
export class MathExtService {
  constructor(private readonly logger: LoggerService) {}

  makeAmortizationSchedule(
    _principal: number,
    _payment: number,
    _interestRate: number,
    _term: number,
    requestId: string,
  ): {
    payment: number;
    interestPaid: number;
    principalPaid: number;
    schedule: {
      id: number;
      payment: number;
      interest: number;
      principal: number;
      startBalance: number;
      endBalance: number;
    }[];
  } {
    const maxAttempts = 100;
    let attempt = 0;

    const amortize = (
      principal: number,
      payment: number,
      interestRate: number,
      term: number,
    ) => {
      ++attempt;
      let principalBalance = 0 + principal;
      let interestPaid = 0;
      let principalPaid = 0;
      const rate = this.float(interestRate / 100 / 12, 7);

      const schedule = [];
      for (let month = 1; month <= term; ++month) {
        let interestPmt = this.float(principalBalance * rate);
        const principalPmt = this.float(
          principalBalance > payment ? payment - interestPmt : principalBalance,
        );

        if (this.float(principalPmt + interestPmt) > payment) {
          interestPmt -= principalPmt + interestPmt - payment;
        }

        let balance = principalBalance - principalPmt;
        balance = this.float(balance);
        interestPaid = this.float(interestPaid + interestPmt);
        principalPaid = this.float(principalPaid + principalPmt);
        const pmt = {
          id: month,
          payment: this.float(principalPmt + interestPmt),
          interest: interestPmt,
          principal: principalPmt,
          startBalance: principalBalance,
          endBalance: balance,
        };
        schedule.push(pmt);

        principalBalance = balance;
      }

      if (principalBalance !== 0 && attempt <= maxAttempts) {
        const adjustedPayment = this.float(payment + 0.01);
        this.logger.log(
          ` balance: ${principalBalance}  adjustedPayment: ${adjustedPayment}`,
          `${MathExtService.name}#amortize`,
          requestId,
        );

        return amortize(principal, adjustedPayment, interestRate, term);
      }

      return {
        payment,
        interestPaid,
        principalPaid,
        schedule,
      };
    };
    return amortize(_principal, _payment, _interestRate, _term);
  }

  /**
   * float
   * @param number number
   * @param precision default to 2 decimal places
   */
  float(number: number, precision = 2) {
    return parseFloat(parseFloat('' + number).toFixed(precision));
  }
}
