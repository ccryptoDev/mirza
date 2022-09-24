import { IPaymentScheduleStatusItem } from './payment-schedule-transactionstatus.interface';

export interface IPaymentScheduleItem {
  amount: number;
  date: Date;
  endPrincipal: number;
  fees: number;
  interest: number;
  month?: number;
  paidFees: number;
  paidInterest: number;
  paidPastDueInterest: number;
  paidPrincipal: number;
  pastDueInterest: number;
  payment: number;
  paymentDate?: Date | undefined;
  paymentId?: string;
  paymentReference?: string | undefined;
  paymentType: 'manual' | 'automatic';
  principal: number;
  startPrincipal: number;
  startTotalBalance?: number;
  status: 'opened' | 'pending' | 'paid' | 'failed' | 'declined' | 'returned';
  transactionId: string;
  isRefund?: boolean;
  isWaived?: boolean;
  isAmended?: boolean;
  refundDate?: Date | undefined;
  refundAmount?: number | 0;
  transactionMessage?: string | undefined;
  transId?: string | undefined;
  transactionStatus?: IPaymentScheduleStatusItem[] | undefined;
  lateFeeApplied?: boolean;
}
