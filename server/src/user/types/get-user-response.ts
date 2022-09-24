import { ApiProperty } from '@nestjs/swagger';

import { Phone } from './phone';
import { Offer } from '../../loan/offers/types/offers-response';

export class GetUserResponse {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  annualIncome: number;

  @ApiProperty()
  approvedUpTo: number;

  @ApiProperty()
  applicationReference: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  isCompleted: boolean;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  lastStep: string;

  @ApiProperty({ type: [Phone] })
  phones: Phone[];

  @ApiProperty()
  referenceNumber: string;

  @ApiProperty()
  requestedAmount: number;

  @ApiProperty()
  ricSignature: string;

  @ApiProperty()
  screenTrackingId: string;

  @ApiProperty({ type: Offer })
  selectedOffer: Offer;

  @ApiProperty()
  ssn: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  zip: string;
}
