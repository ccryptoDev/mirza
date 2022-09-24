import { ApiProperty } from '@nestjs/swagger';

import { LogActivityData } from './log-activity';

export class GetAllLogActivitiesResponse {
  @ApiProperty({ type: LogActivityData })
  items: LogActivityData[];

  @ApiProperty()
  total: number;
}
