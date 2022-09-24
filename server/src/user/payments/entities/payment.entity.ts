import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { PaymentManagement } from '../../../loan/payments/payment-management/entities/payment-management.entity';
import { Merchant } from '../../../admin/merchant/entities/merchant.entity';
import { User } from '../../entities/user.entity';

@Entity({ name: 'user_payments' })
export class Payment {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision' })
  amount: number;

  @ManyToOne(() => PaymentManagement)
  @JoinColumn({ name: 'paymentManagementId' })
  paymentManagement: string | PaymentManagement;

  @Column()
  paymentReference: string;

  @ManyToOne(() => Merchant)
  @JoinColumn({ name: 'merchantId' })
  merchant: string | Merchant;

  @Column({
    type: 'enum',
    enum: ['pending', 'declined', 'returned', 'paid'],
  })
  status: 'pending' | 'declined' | 'returned' | 'paid';

  @Column({ type: 'enum', enum: ['card', 'ach'] })
  type: 'card' | 'ach';

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: string | User;

  @Column({ type: 'enum', enum: ['cliq'] })
  vendor: 'cliq';

  @Column({ nullable: true })
  transactionMessage: string;

  @Column({ nullable: true })
  transactionId: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
