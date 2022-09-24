import { ApiProperty } from '@nestjs/swagger';

export class GetUserCardsResponse {
  @ApiProperty()
  paymentMethodToken: string;

  @ApiProperty()
  cardNumberLastFour: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  cardExpiration: string;

  @ApiProperty()
  isDefault: boolean;
}
