import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Merchant } from './merchant.entity';

@Entity({ name: 'merchant_cards' })
export class Cards {
  @Column()
  billingAddress: string;

  @Column()
  billingCity: string;

  @Column()
  billingName: string;

  @Column()
  billingState: string;

  @Column()
  billingZipCode: string;

  @Column()
  cardExpiryDate: string;

  @Column()
  cardholderName: string;

  @Column()
  cardNumberLastFourDigits: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  customerVaultId: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isPrimaryDisbursementMethod: boolean;

  @ManyToOne(() => Merchant, (merchant) => merchant.cards)
  merchant: Merchant | string;

  @Column()
  securityCode: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
