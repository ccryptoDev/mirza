import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationLinkResponse {
  @ApiProperty()
  applicationLinkUrl: string;

  @ApiProperty()
  id: string;
}
