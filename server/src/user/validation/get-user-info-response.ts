import { ApiProperty } from '@nestjs/swagger';

export class GetUserInfoResponse {
  @ApiProperty()
  userReference: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  street: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  ssnNumber: string;

  @ApiProperty()
  registeredDate: Date;

  @ApiProperty()
  lastProfileUpdateTime: Date;
}
