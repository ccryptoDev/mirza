import { ApiProperty } from '@nestjs/swagger';

export class LogActivityData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdDate: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  ip: string;

  @ApiProperty()
  loanReference: string;

  @ApiProperty()
  logReference: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  moduleName: string;

  @ApiProperty()
  screenTrackingId: string;
}
