import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { CardsDto } from './add-merchant.dto';

@Injectable()
export class AddCard implements PipeTransform {
  transform(value: CardsDto, metadata: ArgumentMetadata): CardsDto {
    const { cardExpiryDate, cardNumber, cardholderName, securityCode } = value;
    if (cardExpiryDate && typeof cardExpiryDate === 'string') {
      value.cardExpiryDate = cardExpiryDate.trim();
    }
    if (cardNumber && typeof cardNumber === 'string') {
      value.cardNumber = cardNumber.trim();
    }
    if (cardholderName && typeof cardholderName === 'string') {
      value.cardholderName = cardholderName.trim().toLowerCase();
    }
    if (securityCode && typeof securityCode === 'string') {
      value.securityCode = securityCode.trim();
    }

    return value;
  }
}
