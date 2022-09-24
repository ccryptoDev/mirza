import {
  IsAlpha,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class MerchantOnboardingAddMerchantDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 75)
  address: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  businessCategory?: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 40)
  city: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  contactName: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  email: string;

  @IsOptional()
  @IsUUID(4)
  id?: string;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(10)
  @MaxLength(10)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 2)
  stateCode: string;

  @IsOptional()
  @IsUrl()
  @Length(1, 100)
  website?: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(5, 5)
  zip: string;
}
