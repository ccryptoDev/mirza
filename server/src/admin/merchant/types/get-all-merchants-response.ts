import { ApiProperty } from '@nestjs/swagger';

import { Merchant } from '../entities/merchant.entity';

export class GetAllMerchantsResponse {
  @ApiProperty({ type: [Merchant] })
  items: Merchant[];

  @ApiProperty()
  total: number;
}
