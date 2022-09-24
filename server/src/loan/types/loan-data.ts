import { ApiProperty } from '@nestjs/swagger';

export class LoanData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  screenTrackingId: string;

  @ApiProperty()
  pmId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  interestRate: number;

  @ApiProperty()
  dateCreated: Date;

  @ApiProperty()
  contractAmount: number;

  @ApiProperty()
  term: number;

  @ApiProperty()
  progress: string;

  @ApiProperty()
  status: string;
}
