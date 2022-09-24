import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsAlpha,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
  IsUUID,
  IsBoolean,
  IsDateString,
} from 'class-validator';

enum PhoneTypeEnum {
  MOBILE = 'mobile',
  HOME = 'home',
  OFFICE = 'office',
}

export class PhonesDto {
  @IsNotEmpty()
  @IsNumberString()
  @MinLength(10)
  @MaxLength(10)
  phone: string;

  @IsNotEmpty()
  @IsEnum(PhoneTypeEnum, {
    message: "'type' should be 'mobile', 'home' or 'office'",
  })
  type: 'mobile' | 'home' | 'office';
}

export class ApplyDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'city should only contain letters and spaces',
  })
  city: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsAlpha()
  firstName: string;

  @IsOptional()
  @IsBoolean()
  isBackendApplication: boolean;

  @IsNotEmpty()
  @IsAlpha()
  lastName: string;

  @IsNotEmpty()
  @Matches(/^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,}$/, {
    message:
      'password should be at least 8 characters long and should have at least 1 number',
  })
  password: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PhonesDto)
  phones: PhonesDto[];

  @IsOptional()
  @IsNotEmpty()
  @IsUUID('4')
  merchant: string;

  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @Length(9, 9)
  ssnNumber: string;

  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 2)
  state: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  unitApt: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(5, 5)
  zipCode: string;
}
