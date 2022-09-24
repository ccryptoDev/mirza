import { ApiProperty } from '@nestjs/swagger';

import { Admin } from './admin';

export class GetAllAdminsResponse {
  @ApiProperty({ type: Admin })
  items: Admin[];

  @ApiProperty()
  total: number;
}
