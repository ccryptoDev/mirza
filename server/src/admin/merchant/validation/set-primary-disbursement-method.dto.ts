import { IsOptional, IsUUID } from 'class-validator';

export class SetPrimaryDisbursementMethodDto {
  @IsOptional()
  @IsUUID('4')
  accountId: string;

  @IsOptional()
  @IsUUID('4')
  cardId: string;
}
