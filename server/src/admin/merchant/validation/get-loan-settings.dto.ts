import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsOptional, IsPositive } from 'class-validator';

export class LoanSettingsDto {
  @IsBoolean()
  autoDisbursementApproval: boolean;

  @IsPositive()
  delinquencyPeriod: number;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value.trim())
  eventsAuthToken?: string;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value.trim())
  eventsUrl?: string;

  @IsPositive()
  lateFee: number;

  @IsPositive()
  lateFeeGracePeriod: number;

  @IsPositive()
  NSFFee: number;
}
