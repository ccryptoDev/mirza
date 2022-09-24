import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Merchant } from './merchant.entity';

@Entity({ name: 'merchant_accounts' })
export class Accounts {
  @Column()
  accountHolder: string;

  @Column()
  accountNumber: string;

  @Column()
  bankName: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isPrimaryDisbursementMethod: boolean;

  @ManyToOne(() => Merchant, (merchant) => merchant.accounts)
  merchant: Merchant | string;

  @Column()
  routingNumber: string;

  @Column()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
