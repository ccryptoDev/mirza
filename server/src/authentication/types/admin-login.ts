import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  userName: string;
}
