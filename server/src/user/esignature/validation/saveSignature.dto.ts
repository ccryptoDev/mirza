import { IsBase64, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveSignatureDto {
  // Extracted from JWT
  screenTrackingId: string;

  @IsOptional()
  @IsString()
  hiddenSignatureId: string;

  @IsNotEmpty()
  @IsBase64()
  imgBase64: string;
}
