import { ApiProperty } from '@nestjs/swagger';

export class Phone {
  @ApiProperty()
  type: string;

  @ApiProperty()
  phone: string;
}
