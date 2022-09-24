import { ApiProperty } from '@nestjs/swagger';

import { UserLogs } from './user-logs';

export class LogsByUserResponse {
  @ApiProperty({ type: UserLogs })
  items: UserLogs[];

  @ApiProperty()
  total: number;
}
