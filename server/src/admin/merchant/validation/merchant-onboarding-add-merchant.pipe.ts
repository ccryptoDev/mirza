import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { MerchantOnboardingAddMerchantDto } from './merchant-onboarding-add-merchant.dto';

@Injectable()
export class MerchantOnboardingAddMerchantPipe implements PipeTransform {
  transform(
    value: MerchantOnboardingAddMerchantDto,
    metadata: ArgumentMetadata,
  ): MerchantOnboardingAddMerchantDto {
    if (value.address && typeof value.address === 'string') {
      value.address = value.address.trim().toLowerCase();
    }
    if (value.businessCategory && typeof value.businessCategory === 'string') {
      value.businessCategory = value.businessCategory.trim().toLowerCase();
    }
    if (value.city && typeof value.city === 'string') {
      value.city = value.city.trim().toLowerCase();
    }
    if (value.contactName && typeof value.contactName === 'string') {
      value.contactName = value.contactName.trim().toLowerCase();
    }
    if (value.email && typeof value.email === 'string') {
      value.email = value.email.trim().toLowerCase();
    }
    if (value.name && typeof value.name === 'string') {
      value.name = value.name.trim().toLowerCase();
    }
    if (value.website && typeof value.website === 'string') {
      value.website = value.website.trim().toLowerCase();
    }
    return value;
  }
}
