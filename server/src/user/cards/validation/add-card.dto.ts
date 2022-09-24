import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class AddCardDto {
  @IsNotEmpty()
  @IsString()
  billingAddress: string;

  @IsNotEmpty()
  @IsString()
  billingCity: string;

  @IsOptional()
  @IsString()
  billingFirstName: string;

  @IsOptional()
  @IsString()
  billingLastName: string;

  @IsNotEmpty()
  @IsString()
  billingState: string;

  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @Length(5, 5)
  billingZip: string;

  @IsNotEmpty()
  @IsString()
  cardholderName: string;

  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @Length(16, 16)
  cardNumber: string;

  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @Length(3, 3)
  cvv: string;

  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @Length(2, 2)
  expirationMonth: string;

  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @Length(2, 2)
  expirationYear: string;

  @IsOptional()
  @IsBoolean()
  isDefaultPaymentMethod: boolean;
}
