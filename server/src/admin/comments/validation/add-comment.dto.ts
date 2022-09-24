import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentDto {
  @IsNotEmpty()
  @IsString()
  comment: string;

  createdBy: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  screenTrackingId: string;
}
