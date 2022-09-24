import { ApiProperty } from '@nestjs/swagger';

export class UserLogs {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdDate: Date;

  @ApiProperty()
  logReference: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  moduleName: string;
}
