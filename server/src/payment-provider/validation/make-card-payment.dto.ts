import { IsNotEmpty, IsNumberString, IsPositive } from 'class-validator';

export class MakeCardPaymentDto {
  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  customerVaultId: string;

  @IsPositive()
  amount: number;
}
