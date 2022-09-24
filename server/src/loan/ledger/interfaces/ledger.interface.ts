export interface ILedger {
  accruedFeesBalance: number;
  accruedInterestBalance: number;
  cycleAccruedInterest: number;
  cycleEndDate: Date | undefined;
  cyclePaidInterestBalance: number;
  cyclePaidPrincipalBalance: number;
  cyclePaymentBalance: number;
  cyclePrincipalBalance: number;
  cycleStartDate: Date | undefined;
  dailyInterest: number;
  daysInCycle: number;
  daysPastDue: number;
  ledgerDate: Date | undefined;
  loanStartDate: Date | undefined;
  paidFeesBalance: number;
  paidInterestBalance: number;
  paidPastDueInterestBalance: number;
  paidPrincipalBalance: number;
  pastDueInterestBalance: number;
  paymentBalance: number;
  payoff: number;
  payoffWithNoFees: number;
  principalBalance: number;
  unpaidInterestBalance: number;
}
