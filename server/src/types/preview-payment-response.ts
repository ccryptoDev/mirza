import { ApiProperty } from '@nestjs/swagger';

import { PaymentSchedule } from './payment-schedule';

class LedgerData {
  @ApiProperty()
  accruedFeesBalance: number;

  @ApiProperty()
  accruedInterestBalance: number;

  @ApiProperty()
  cycleAccruedInterest: number;

  @ApiProperty()
  cycleEndDate: Date;

  @ApiProperty()
  cyclePaidInterestBalance: number;

  @ApiProperty()
  cyclePaidPrincipalBalance: number;

  @ApiProperty()
  cyclePaymentBalance: number;

  @ApiProperty()
  cyclePrincipalBalance: number;

  @ApiProperty()
  cycleStartDate: Date;

  @ApiProperty()
  dailyInterest: number;

  @ApiProperty()
  daysInCycle: number;

  @ApiProperty()
  daysPastDue: number;

  @ApiProperty()
  ledgerDate: Date;

  @ApiProperty()
  loanStartDate: Date;

  @ApiProperty()
  paidFeesBalance: number;

  @ApiProperty()
  paidInterestBalance: number;

  @ApiProperty()
  paidPastDueInterestBalance: number;

  @ApiProperty()
  paidPrincipalBalance: number;

  @ApiProperty()
  pastDueInterestBalance: number;

  @ApiProperty()
  paymentBalance: number;

  @ApiProperty()
  payoff: number;

  @ApiProperty()
  payoffWithNoFees: number;

  @ApiProperty()
  principalBalance: number;

  @ApiProperty()
  promoStatus: string;

  @ApiProperty()
  unpaidInterestBalance: number;
}

class BalanceData {
  @ApiProperty()
  fees: number;

  @ApiProperty()
  interest: number;

  @ApiProperty()
  unpaidInterest: number;

  @ApiProperty()
  principal: number;
}

class PreviewData {
  @ApiProperty()
  payment: number;

  @ApiProperty()
  daysPastDue: number;

  @ApiProperty()
  accruedInterest: number;

  @ApiProperty({ type: BalanceData })
  accruedBalance: BalanceData;

  @ApiProperty({ type: BalanceData })
  paymentBalance: BalanceData;

  @ApiProperty({ type: BalanceData })
  unpaidBalance: BalanceData;

  @ApiProperty({ type: [PaymentSchedule] })
  paymentSchedule: PaymentSchedule[];

  @ApiProperty()
  nextPaymentSchedule: Date;

  @ApiProperty()
  newScheduleItemIndex: number;

  @ApiProperty()
  newScheduleItemTransactionId: string;

  @ApiProperty()
  payoff: number;
}

class PreviewResult {
  @ApiProperty()
  paymentAmount: number;

  @ApiProperty({ type: LedgerData })
  ledger: LedgerData;

  @ApiProperty({ type: PreviewData })
  preview: PreviewData;

  @ApiProperty({ type: PaymentSchedule })
  newPaymentScheduleItem: PaymentSchedule;
}

export class PreviewPaymentResponse {
  @ApiProperty()
  regularPayment: number;

  @ApiProperty()
  payoff: number;

  @ApiProperty({ type: PreviewResult })
  previewResult: PreviewResult;
}
