import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class MakePaymentDto {
  // Extracted from JWT
  user: string;

  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsUUID('4')
  paymentMethodToken: string;
}
