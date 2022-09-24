import { ApiProperty } from '@nestjs/swagger';

import { UserData } from './user-data';

export class GetAllUsersResponse {
  @ApiProperty({ type: UserData })
  items: UserData[];

  @ApiProperty()
  total: number;
}
