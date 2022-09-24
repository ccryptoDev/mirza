import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export default class GetAllUsersDto {
  @IsPositive()
  page: number;

  @IsPositive()
  perPage: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  search: string;
}
