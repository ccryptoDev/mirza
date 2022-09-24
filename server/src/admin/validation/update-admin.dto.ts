import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

enum AdminRoles {
  MANAGER_LA = 'Manager',
  SUPER_ADMIN = 'Super Admin',
  USER_SERVICING = 'Merchant Staff',
}

export class UpdateAdminDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(AdminRoles)
  role: 'Manager' | 'Super Admin' | 'Merchant Staff';

  @ValidateIf((o) => o.role !== 'Super Admin')
  @IsNotEmpty()
  @IsUUID('4')
  merchant: string;
}
