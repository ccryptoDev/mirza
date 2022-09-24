import { ApiProperty } from '@nestjs/swagger';

import { Offer } from '../../../loan/offers/types/offers-response';

export class GetApplicationInfoResponse {
  @ApiProperty()
  annualIncome: number;

  @ApiProperty()
  city: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  financingReferenceNumber: string;

  @ApiProperty()
  financingStatus: string;

  @ApiProperty()
  lastProfileUpdatedAt: Date;

  @ApiProperty()
  monthlyIncome: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  phoneType: string;

  @ApiProperty({ type: Offer })
  selectedOffer: Offer;

  @ApiProperty()
  ricSignature: string;

  @ApiProperty()
  registeredAt: Date;

  @ApiProperty()
  requestedAmount: number;

  @ApiProperty()
  ssnNumber: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  unitApt: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userReference: string;

  @ApiProperty()
  zipCode: string;
}
