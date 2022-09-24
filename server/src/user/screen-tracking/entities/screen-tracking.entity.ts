import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../entities/user.entity';
import { Merchant } from '../../../admin/merchant/entities/merchant.entity';
import Offer from '../../../loan/offers/interfaces/Offer';

@Entity()
export class ScreenTracking {
  @Column()
  applicationReference: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isBackendApplication: boolean;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({
    type: 'enum',
    enum: ['apply', 'offers', 'sign-contract', 'repayment'],
  })
  lastLevel: 'apply' | 'offers' | 'sign-contract' | 'repayment';

  @Column({ type: 'jsonb', nullable: true })
  selectedOffer: Offer;

  @ManyToOne(() => Merchant)
  @JoinColumn({ name: 'merchantId' })
  merchant: string | Merchant;

  @ManyToOne(() => User, (user) => user.screenTracking)
  @JoinColumn({ name: 'userId' })
  user: string | User;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
