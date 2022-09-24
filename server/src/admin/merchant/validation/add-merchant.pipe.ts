import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import AddMerchantDto from './add-merchant.dto';

@Injectable()
export class AddMerchantPipe implements PipeTransform {
  transform(
    requestBody: AddMerchantDto,
    metadata: ArgumentMetadata,
  ): AddMerchantDto {
    if (requestBody.information) {
      const { information } = requestBody;
      if (information.name && typeof information.name === 'string') {
        information.name = information.name.trim().toLowerCase();
      }
      if (
        information.contactName &&
        typeof information.contactName === 'string'
      ) {
        information.contactName = information.contactName.trim().toLowerCase();
      }
      if (information.email && typeof information.email === 'string') {
        information.email = information.email.trim().toLowerCase();
      }
      if (information.address && typeof information.address === 'string') {
        information.address = information.address.trim().toLowerCase();
      }
      if (information.city && typeof information.city === 'string') {
        information.city = information.city.trim().toLowerCase();
      }
      if (
        information.businessCategory &&
        typeof information.businessCategory === 'string'
      ) {
        information.businessCategory = information.businessCategory
          .trim()
          .toLowerCase();
      }
      if (information.website && typeof information.website === 'string') {
        information.website = information.website.trim().toLowerCase();
      }
    }
    return requestBody;
  }
}
