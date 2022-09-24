import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class MakePaymentDialogPipe implements PipeTransform<any> {
  async transform(requestBody: any, { metatype }: ArgumentMetadata) {
    if (requestBody.amount && typeof requestBody.amount === 'string') {
      requestBody.amount = +requestBody.amount.replace(/[^.0-9]+/, '');
    }

    const object = plainToClass(metatype, requestBody);
    const errors = await validate(object, {
      forbidUnknownValues: true,
      validationError: { target: false, value: true },
    });
    if (errors.length > 0) {
      throw new BadRequestException(errors, 'Invalid data');
    }

    return requestBody;
  }
}
