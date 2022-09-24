import { ApiProperty } from '@nestjs/swagger';

export class Offer {
  @ApiProperty()
  downPayment: number;

  @ApiProperty()
  contractAmount: number;

  @ApiProperty()
  apr: number;

  @ApiProperty()
  monthlyPayment: number;

  @ApiProperty()
  term: number;
}

export class OffersResponse {}
