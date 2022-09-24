import { IsPositive } from 'class-validator';

export class ChangePaymentAmountDto {
  @IsPositive()
  amount: number;

  screenTracking?: string;
}
