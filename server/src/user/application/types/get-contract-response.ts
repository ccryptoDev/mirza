import { ApiProperty } from '@nestjs/swagger';

import { Offer } from '../../../loan/offers/types/offers-response';

class ScreenTracking {
  @ApiProperty()
  applicationReference: string;

  @ApiProperty()
  approveUpTo: number;

  @ApiProperty()
  skipAutoPay: boolean;
}

class PaymentData {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  due: string;

  @ApiProperty()
  numberOfPayments: number;
}

class PaymentScheduleInfo {
  @ApiProperty({ type: PaymentData })
  lastPayment: PaymentData;

  @ApiProperty({ type: PaymentData })
  regularPayment: PaymentData;

  @ApiProperty({ type: PaymentData })
  totalPayments: PaymentData;
}

class Provider {
  @ApiProperty()
  name: string;

  @ApiProperty()
  streetAddress: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  stateCode: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  phone: string;
}

class UserData {
  @ApiProperty()
  userReference: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  ip: string;
}

export class GetContractResponse {
  @ApiProperty({ type: ScreenTracking })
  screenTracking: ScreenTracking;

  @ApiProperty({ type: PaymentScheduleInfo })
  paymentScheduleInfo: PaymentScheduleInfo;

  @ApiProperty({ type: Provider })
  provider: Provider;

  @ApiProperty({ type: Offer })
  selectedOffer: Offer;

  @ApiProperty({ type: UserData })
  userData: UserData;

  @ApiProperty()
  date: string;
}
