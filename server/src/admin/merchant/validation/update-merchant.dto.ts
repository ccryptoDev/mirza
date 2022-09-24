import { PartialType } from '@nestjs/swagger';
import AddMerchantDto from './add-merchant.dto';

export default class UpdateMerchantDto extends PartialType(AddMerchantDto) {}
