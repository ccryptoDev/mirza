import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

enum AdminRoles {
  MANAGER_LA = 'Manager',
  MERCHANT = 'Merchant',
  SUPER_ADMIN = 'Super Admin',
  USER_SERVICING = 'Merchant Staff',
}

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;

  @IsNotEmpty()
  @IsEnum(AdminRoles)
  role: 'Manager' | 'Super Admin' | 'Merchant' | 'Merchant Staff';

  @ValidateIf((o) => o.role !== 'Super Admin')
  @IsNotEmpty()
  @IsUUID('4')
  merchantId: string;
}
