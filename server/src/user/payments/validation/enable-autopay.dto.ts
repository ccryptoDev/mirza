import { IsUUID } from 'class-validator';

export class EnableAutopayDto {
  @IsUUID('4')
  paymentManagementId: string;
}
