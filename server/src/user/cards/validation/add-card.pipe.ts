import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

import { AddCardDto } from './add-card.dto';

@Injectable()
export class AddCardPipe implements PipeTransform<any> {
  transform(requestBody: AddCardDto, metadata: ArgumentMetadata): AddCardDto {
    if (
      requestBody.billingAddress &&
      typeof requestBody.billingAddress === 'string'
    ) {
      requestBody.billingAddress = requestBody.billingAddress
        .trim()
        .toLocaleLowerCase();
    }
    if (requestBody.billingCity) {
      requestBody.billingCity = requestBody.billingCity
        .trim()
        .toLocaleLowerCase();
    }
    if (requestBody.billingFirstName) {
      requestBody.billingFirstName = requestBody.billingFirstName
        .trim()
        .toLocaleLowerCase();
    }
    if (requestBody.billingLastName) {
      requestBody.billingLastName = requestBody.billingLastName
        .trim()
        .toLocaleLowerCase();
    }
    if (requestBody.billingState) {
      requestBody.billingState = requestBody.billingState.trim();
    }
    if (requestBody.billingZip) {
      requestBody.billingZip = requestBody.billingZip.trim();
    }
    if (requestBody.cardholderName) {
      requestBody.cardholderName = requestBody.cardholderName
        .trim()
        .toLocaleLowerCase();
    }
    if (requestBody.cvv) {
      requestBody.cvv = requestBody.cvv.trim();
    }
    if (requestBody.cardNumber) {
      requestBody.cardNumber = requestBody.cardNumber.trim();
    }
    if (requestBody.expirationMonth) {
      requestBody.expirationMonth = requestBody.expirationMonth.trim();
    }
    if (requestBody.expirationYear) {
      requestBody.expirationYear = requestBody.expirationYear.trim();
    }

    return requestBody;
  }
}
