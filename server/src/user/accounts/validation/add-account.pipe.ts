import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { AddAccountDto } from './add-account.dto';

@Injectable()
export class AddAccount implements PipeTransform {
  transform(value: AddAccountDto, metadata: ArgumentMetadata): AddAccountDto {
    const {
      accountHolder,
      accountNumber,
      bankName,
      routingNumber,
      bankAddress,
    } = value;
    if (accountHolder && typeof accountHolder === 'string') {
      value.accountHolder = accountHolder.trim().toLowerCase();
    }
    if (accountNumber && typeof accountNumber === 'string') {
      value.accountNumber = accountNumber.trim();
    }
    if (bankName && typeof bankName === 'string') {
      value.bankName = bankName.trim().toLowerCase();
    }
    if (routingNumber && typeof routingNumber === 'string') {
      value.routingNumber = routingNumber.trim();
    }
    if (bankAddress && typeof bankAddress === 'string') {
      value.bankAddress = bankAddress.trim().toLocaleLowerCase();
    }

    return value;
  }
}
