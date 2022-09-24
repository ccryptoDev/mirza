import { ApiProperty } from '@nestjs/swagger';

export class AddCommentResponse {
  @ApiProperty()
  commentId: string;
}
