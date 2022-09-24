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
  billingAddress1: string;

  @IsOptional()
  @IsString()
  billingAddress2: string;

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
  @IsNumberString({ no_symbols: true })
  @Length(3, 4)
  cardCode: string;

  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @Length(15, 16)
  cardNumber: string;

  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @Length(2, 2)
  expMonth: string;

  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @Length(2, 2)
  expYear: string;

  @IsOptional()
  @IsBoolean()
  isDefaultPaymentMethod: boolean;

  // Extracted from JWT
  screenTrackingId: string;
}
