import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class AddAccountDto {
  @IsString()
  @IsNotEmpty()
  accountHolder: string;

  @IsNumberString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsOptional()
  @IsString()
  bankAddress: string;

  @IsBoolean()
  isDefaultPaymentMethod: boolean;

  @IsString()
  @Length(9, 9)
  routingNumber: string;
}
