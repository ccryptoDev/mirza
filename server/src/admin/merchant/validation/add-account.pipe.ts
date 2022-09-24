import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { AccountsDto } from './add-merchant.dto';

@Injectable()
export class AddAccount implements PipeTransform {
  transform(value: AccountsDto, metadata: ArgumentMetadata): AccountsDto {
    const { accountHolder, accountNumber, bankName, routingNumber } = value;
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

    return value;
  }
}
