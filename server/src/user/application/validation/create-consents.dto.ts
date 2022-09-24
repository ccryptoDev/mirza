import { IsUUID } from 'class-validator';

export class CreateConsentsDto {
  @IsUUID('4')
  merchantId: string;
}
