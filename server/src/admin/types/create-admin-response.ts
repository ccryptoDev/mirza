import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminResponse {
  @ApiProperty()
  adminId: string;
}
