import { ApiProperty } from '@nestjs/swagger';

export class ESignatureResponse {
  @ApiProperty()
  esignatureId: string;
}
