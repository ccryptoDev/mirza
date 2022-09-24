import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsAlpha,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class MerchantInformationDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  address: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  businessCategory?: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  city: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  contactName: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
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
  @Length(1, 30)
  name: string;

  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 2)
  stateCode: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(5, 5)
  zip: string;
}

enum DownPaymentType {
  DOLLAR_AMOUNT = 'dollarAmount',
  PERCENTAGE = 'percentage',
}

class Tiers {
  @IsBoolean()
  active: boolean;

  @IsNumber()
  apr: number;

  @IsNumber()
  downPayment: number;

  @IsNumber()
  ficoMax: number;

  @IsNumber()
  ficoMin: number;

  @IsNumber()
  contractAmount: number;

  @IsNumber()
  merchantDiscountRate: number;

  @IsNumber()
  minAnnualIncome: number;

  @IsString()
  name: string;
}

class LoanSettings {
  @IsBoolean()
  active: boolean;

  @IsNumber()
  loanTerm: number;

  @ValidateNested({ each: true })
  @Type((): typeof Tiers => Tiers)
  tiers: Tiers[];

  @ArrayNotEmpty()
  activeStates: 'all'[];
}
export class MerchantTermsDto {
  @IsEnum(DownPaymentType)
  downPaymentType: 'dollarAmount' | 'percentage';

  @ValidateNested({ each: true })
  @Type((): typeof LoanSettings => LoanSettings)
  loanSettings: LoanSettings[];
}

export class ContractSettingsDto {
  @IsNumber()
  APRReductionRate: number;

  @IsNumber()
  contractSellAmount: number;

  @IsNumber()
  contractSellerFee: number;

  @IsNumber()
  feeReductionRate: number;

  @IsBoolean()
  separateTransactions: boolean;

  @IsBoolean()
  saasFee: boolean;

  @ValidateIf((o) => o.saasFee)
  @IsNumber()
  saasFeeAmount: number;

  @ValidateIf((o) => o.saasFee)
  @IsNumberString()
  saasFeePaymentDay: string;
}

export class CreditReportSettingsDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  industryCode: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  memberCode: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  password: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  prefixCode: string;
}

export class AccountsDto {
  @IsNotEmpty()
  @IsString()
  accountHolder: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsBoolean()
  isPrimaryDisbursementMethod: boolean;

  @IsNotEmpty()
  @IsString()
  routingNumber: string;
}

export class CardsDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  billingAddress: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  billingCity: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  billingName: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  billingState: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  billingZipCode: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  cardholderName: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  cardExpiryDate: string;

  @IsBoolean()
  isPrimaryDisbursementMethod: boolean;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value.trim())
  securityCode: string;
}

export class LoanSettingsDto {
  @IsBoolean()
  autoDisbursementApproval: boolean;

  @Min(0)
  delinquencyPeriod: number;

  @Min(0)
  lateFee: number;

  @Min(0)
  lateFeeGracePeriod: number;

  @Min(0)
  NSFFee: number;
}

export default class AddMerchantDto {
  @ValidateNested()
  @Type((): typeof MerchantInformationDto => MerchantInformationDto)
  information: MerchantInformationDto;

  @ValidateNested({ each: true })
  @Type((): typeof MerchantTermsDto => MerchantTermsDto)
  terms: MerchantTermsDto;

  @ValidateNested()
  @Type((): typeof ContractSettingsDto => ContractSettingsDto)
  contractSettings: ContractSettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type((): typeof CreditReportSettingsDto => CreditReportSettingsDto)
  creditReportSettings: CreditReportSettingsDto;

  @ValidateNested()
  @Type((): typeof AccountsDto => AccountsDto)
  accounts: AccountsDto;

  @ValidateNested()
  @Type((): typeof CardsDto => CardsDto)
  cards: CardsDto;

  @ValidateNested()
  @Type((): typeof LoanSettingsDto => LoanSettingsDto)
  loanSettings: LoanSettingsDto;
}
