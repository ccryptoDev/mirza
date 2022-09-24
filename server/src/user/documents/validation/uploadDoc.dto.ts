import { IsBase64, IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';

enum DocumentTypeEnum {
  DRIVERS_LICENSE = 'drivers license',
  PASSPORT = 'passport',
}

export default class UploadDocDto {
  // Extracted from JWT
  userId: string;

  @IsNotEmpty()
  @IsEnum(DocumentTypeEnum, {
    message: "'documentType' should be either 'drivers license' or 'passport'",
  })
  documentType: DocumentTypeEnum;

  @ValidateIf((o) => o.documentType === 'drivers license')
  @IsNotEmpty()
  @IsBase64()
  driversLicenseFront: string;

  @ValidateIf((o) => o.documentType === 'drivers license')
  @IsNotEmpty()
  @IsBase64()
  driversLicenseBack: string;

  @ValidateIf((o) => o.documentType === 'passport')
  @IsNotEmpty()
  @IsBase64()
  passport: string;
}
