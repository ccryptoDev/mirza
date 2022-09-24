import { ApiProperty } from '@nestjs/swagger';

export class ApplicationLoginResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  token: string;
}
