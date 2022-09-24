import { ApiProperty } from '@nestjs/swagger';

import { ScreenTracking } from '../screen-tracking/entities/screen-tracking.entity';
import { PaymentSchedule } from '../../types/payment-schedule';
import { Phone } from './phone';

class PaymentManagementData {
  @ApiProperty()
  apr: number;

  @ApiProperty()
  canRunAutomaticPayment: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  currentPaymentAmount: number;

  @ApiProperty()
  id: string;

  @ApiProperty({ type: [PaymentSchedule] })
  initialPaymentSchedule: PaymentSchedule[];

  @ApiProperty()
  interestApplied: number;

  @ApiProperty()
  loanReference: string;

  @ApiProperty()
  loanStartDate: string;

  @ApiProperty()
  loanTermCount: number;

  @ApiProperty()
  maturityDate: string;

  @ApiProperty()
  minimumPaymentAmount: number;

  @ApiProperty()
  nextPaymentSchedule: string;

  @ApiProperty({ type: [PaymentSchedule] })
  paymentSchedule: PaymentSchedule[];

  @ApiProperty()
  payOffAmount: number;

  @ApiProperty()
  principalAmount: number;

  @ApiProperty()
  promoPaymentAmount: number;

  @ApiProperty()
  promoSelected: boolean;

  @ApiProperty()
  promoStatus: string;

  @ApiProperty()
  promoTermCount: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: ScreenTracking })
  screenTracking: ScreenTracking;
}

class UserAccountsData {
  @ApiProperty()
  paymentMethodToken: string;

  @ApiProperty()
  cardNumberLastFour: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  cardExpiration: string;

  @ApiProperty()
  isDefault: boolean;
}

class DocumentData {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  driversLicense: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  passport: string;

  @ApiProperty()
  uploaderId: string;

  @ApiProperty()
  uploaderName: string;

  @ApiProperty()
  uploaderRole: string;

  @ApiProperty()
  updatedAt: Date;
}

class DriversLicense {
  @ApiProperty()
  front: string;

  @ApiProperty()
  back: string;
}

export class GetDashboardResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ type: Phone })
  phone: Phone;

  @ApiProperty()
  email: string;

  @ApiProperty()
  smsPolicyPath: string;

  @ApiProperty()
  esignaturePath: string;

  @ApiProperty()
  ricPath: string;

  @ApiProperty({ type: [Object] })
  eftaConsents: Record<string, any>[];

  @ApiProperty({ type: PaymentManagementData })
  paymentManagementData: PaymentManagementData;

  @ApiProperty({ type: [UserAccountsData] })
  userAccountsData: UserAccountsData[];

  @ApiProperty()
  passportPath: string;

  @ApiProperty({ type: DriversLicense })
  driversLicense: DriversLicense;

  @ApiProperty({ type: [DocumentData] })
  userDocuments: DocumentData[];
}
