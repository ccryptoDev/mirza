import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class MakePaymentDialogDto {
  @IsOptional()
  @IsNumber()
  amount: number;

  @IsDateString()
  paymentDate: Date;
}
