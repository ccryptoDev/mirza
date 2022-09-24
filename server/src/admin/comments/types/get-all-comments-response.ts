import { ApiProperty } from '@nestjs/swagger';

class CommentsData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdDate: Date;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  comment: string;
}

export class GetAllCommentsResponse {
  @ApiProperty({ type: CommentsData })
  items: CommentsData[];

  @ApiProperty()
  total: number;
}
