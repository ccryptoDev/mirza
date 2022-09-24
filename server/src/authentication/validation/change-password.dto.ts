import { IsNotEmpty, IsString, MinLength } from 'class-validator';

// Used for both admin and user
export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  existingPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  newPassword: string;
}
