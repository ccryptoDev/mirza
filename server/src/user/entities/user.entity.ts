import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Merchant } from '../../admin/merchant/entities/merchant.entity';
import { ScreenTracking } from '../screen-tracking/entities/screen-tracking.entity';
import { Roles } from '../../authentication/roles/entities/roles.entity';
import { Accounts } from '../accounts/entities/accounts.entity';
import { Cards } from '../cards/entities/cards.entity';
@Entity()
export class User {
  @OneToMany((): typeof Accounts => Accounts, (accounts) => accounts.user)
  accounts: Accounts;

  @OneToMany((): typeof Cards => Cards, (cards) => cards.user)
  cards: Cards;

  @Column()
  city: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ nullable: true })
  customerUpdateToken: string;

  @Column({ nullable: true })
  customerUpdateTokenExpires: Date;

  @Column()
  dateOfBirth: Date;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isBackendApplication: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isExistingLoan: boolean;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ type: 'jsonb' })
  phones: { phone: string; type: 'mobile' | 'home' | 'office' }[];

  @ManyToOne(() => Merchant)
  @JoinColumn({ name: 'merchantId' })
  merchant: string | Merchant;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordTokenExpires: Date;

  @ManyToOne(() => Roles)
  @JoinColumn({ name: 'roleId' })
  role: string | Roles;

  @OneToOne(() => ScreenTracking, (screenTracking) => screenTracking.user)
  screenTracking: string | ScreenTracking;

  @Column()
  ssnNumber: string;

  @Column()
  state: string;

  @Column()
  street: string;

  @Column({ nullable: true })
  unitApt: string;

  @Column()
  userReference: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column()
  zipCode: string;
}
