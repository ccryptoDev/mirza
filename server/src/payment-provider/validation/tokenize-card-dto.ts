import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

export class TokenizeCardDto {
  @IsNotEmpty()
  @IsString()
  address1: string;

  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @Length(16, 16)
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  city: string;

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

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  zip: string;
}
