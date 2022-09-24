import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { AddCardDto } from '../validation/addCard.dto';

@Injectable()
export class AddCardPipe implements PipeTransform<any> {
  async transform(requestBody: AddCardDto, { metatype }: ArgumentMetadata) {
    if (
      requestBody.billingAddress1 &&
      typeof requestBody.billingAddress1 === 'string'
    ) {
      requestBody.billingAddress1 = requestBody.billingAddress1.trim();
    }
    if (requestBody.billingAddress2) {
      requestBody.billingAddress2 = requestBody.billingAddress2.trim();
    }
    if (requestBody.billingCity) {
      requestBody.billingCity = requestBody.billingCity.trim();
    }
    if (requestBody.billingLastName) {
      requestBody.billingLastName = requestBody.billingLastName.trim();
    }
    if (requestBody.billingState) {
      requestBody.billingState = requestBody.billingState.trim();
    }
    if (requestBody.billingZip) {
      requestBody.billingZip = requestBody.billingZip.trim();
    }
    if (requestBody.cardCode) {
      requestBody.cardCode = requestBody.cardCode.trim();
    }
    if (requestBody.cardNumber) {
      requestBody.cardNumber = requestBody.cardNumber.trim();
    }
    if (requestBody.expMonth) {
      requestBody.expMonth = requestBody.expMonth.trim();
    }
    if (requestBody.expYear) {
      requestBody.expYear = requestBody.expYear.trim();
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
