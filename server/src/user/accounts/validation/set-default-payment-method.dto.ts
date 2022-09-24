import { IsUUID } from 'class-validator';

export class SetDefaultPaymentMethodDto {
  @IsUUID('4')
  accountId: string;
}
