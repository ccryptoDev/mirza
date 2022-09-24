import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ILoanSettings } from '../interfaces/MerchantTerms';

@Entity({ name: 'merchant_terms' })
export class Terms {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: ['dollarAmount', 'percentage'],
  })
  downPaymentType: 'dollarAmount' | 'percentage';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  loanSettings: ILoanSettings[];

  @Column()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
