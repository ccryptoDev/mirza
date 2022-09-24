import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorResponse {
  @ApiProperty({ type: [Object] })
  message: Record<string, any>[];
}
