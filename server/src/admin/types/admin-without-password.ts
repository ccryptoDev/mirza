import { OmitType } from '@nestjs/swagger';
import { Admin } from '../entities/admin.entity';

export class AdminWithoutPassword extends OmitType(Admin, [
  'password',
] as const) {}
