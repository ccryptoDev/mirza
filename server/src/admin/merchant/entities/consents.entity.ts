import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Merchant } from './merchant.entity';

@Entity({ name: 'merchant_consents' })
export class Consents {
  @Column({ nullable: true })
  documentPath?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: ['Terms and Conditions', 'Consent to Fees'],
  })
  documentName: 'Terms and Conditions' | 'Consent to Fees';

  @Column()
  documentVersion: number;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ip: string;

  @ManyToOne(() => Merchant)
  @JoinColumn({ name: 'merchantId' })
  merchant: string | Merchant;

  @Column()
  signedAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
