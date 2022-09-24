import { ApiProperty } from '@nestjs/swagger';

import { LoanData } from '../../../loan/types/loan-data';

export class GetAllLoansResponse {
  @ApiProperty({ type: LoanData })
  items: LoanData[];

  @ApiProperty()
  total: number;
}
