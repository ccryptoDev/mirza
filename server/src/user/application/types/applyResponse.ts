import { ApiProperty } from '@nestjs/swagger';

export class ApplyResponse {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  screenTrackingId: string;

  @ApiProperty()
  referenceNumber: string;
}
