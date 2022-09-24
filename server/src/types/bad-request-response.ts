import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { ValidationErrorResponse } from './validation-error-response';

@ApiExtraModels(ValidationErrorResponse)
export class BadRequestResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty({
    oneOf: [
      {
        type: 'string',
      },
      {
        $ref: getSchemaPath(ValidationErrorResponse),
      },
    ],
  })
  message: string | ValidationErrorResponse;
}
