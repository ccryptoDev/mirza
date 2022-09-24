import { ApiProperty } from '@nestjs/swagger';

export class PaymentSchedule {
  @ApiProperty()
  date: string;

  @ApiProperty()
  fees: number;

  @ApiProperty()
  month: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  payment: number;

  @ApiProperty()
  interest: number;

  @ApiProperty()
  paidFees: number;

  @ApiProperty()
  principal: number;

  @ApiProperty()
  paymentType: string;

  @ApiProperty()
  endPrincipal: number;

  @ApiProperty()
  paidInterest: number;

  @ApiProperty()
  paidPrincipal: number;

  @ApiProperty()
  transactionId: string;

  @ApiProperty()
  startPrincipal: number;

  @ApiProperty()
  pastDueInterest: number;

  @ApiProperty()
  paidPastDueInterest: number;
}
