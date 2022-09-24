import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Merchant } from '../merchant/entities/merchant.entity';
import { Roles } from '../../authentication/roles/entities/roles.entity';

@Entity({ name: 'admin_user' })
export class Admin {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  email: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isDeleted: boolean;

  @Column()
  password?: string;

  @Column()
  phoneNumber: string;

  @ManyToOne((): typeof Merchant => Merchant)
  @JoinColumn({ name: 'merchantId' })
  merchant: string | Merchant;

  @ManyToOne((): typeof Roles => Roles)
  @JoinColumn({ name: 'roleId' })
  role: string | Roles;

  @Column()
  userName: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
