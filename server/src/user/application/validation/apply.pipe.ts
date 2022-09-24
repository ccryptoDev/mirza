import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

import { ApplyDto } from './apply.dto';

@Injectable()
export class ApplyPipe implements PipeTransform {
  transform(value: ApplyDto, metadata: ArgumentMetadata): ApplyDto {
    if (value.city && typeof value.city === 'string') {
      value.city = value.city.trim().toLocaleLowerCase();
    }
    if (value.email && typeof value.email === 'string') {
      value.email = value.email.trim().toLocaleLowerCase();
    }
    if (value.firstName && typeof value.firstName === 'string') {
      value.firstName = value.firstName.trim().toLocaleLowerCase();
    }
    if (value.lastName && typeof value.lastName === 'string') {
      value.lastName = value.lastName.trim().toLocaleLowerCase();
    }
    if (value.ssnNumber && typeof value.ssnNumber === 'string') {
      value.ssnNumber = value.ssnNumber.trim();
    }
    if (value.state && typeof value.state === 'string') {
      value.state = value.state.trim().toUpperCase();
    }
    if (value.street && typeof value.street === 'string') {
      value.street = value.street.trim().toLocaleLowerCase();
    }
    if (value.unitApt && typeof value.unitApt === 'string') {
      value.unitApt = value.unitApt.trim();
    }
    if (value.zipCode && typeof value.zipCode === 'string') {
      value.zipCode = value.zipCode.trim();
    }

    return value;
  }
}
