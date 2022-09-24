import { Roles } from '../roles/entities/roles.entity';

export type AdminJwtPayload = {
  id: string;
  email: string;
  userName: string;
  merchant: string;
  role: Roles['roleName'];
};

export type UserJwtPayload = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  screenTracking: string;
  role: Roles['roleName'];
};
