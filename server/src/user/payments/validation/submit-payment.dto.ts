import { IsDateString, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class SubmitPaymentDto {
  @IsNotEmpty()
  @IsUUID('4')
  paymentMethodToken: string;

  @IsPositive()
  amount: number;

  @IsDateString()
  paymentDate: Date;
}
