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
import { ScreenTracking } from '../../screen-tracking/entities/screen-tracking.entity';

@Entity({ name: 'user_consents' })
export class UserConsent {
  @Column({ nullable: true })
  documentPath: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: [
      'Text and Call Policy',
      'E-Signature',
      'Credit Pull Authorization',
      'Fair Credit Reporting Act',
      'Retail Installment Contract',
      'ACH Authorization',
    ],
  })
  documentName:
    | 'Text and Call Policy'
    | 'E-Signature'
    | 'Credit Pull Authorization'
    | 'Fair Credit Reporting Act'
    | 'Retail Installment Contract'
    | 'ACH Authorization';

  @Column()
  documentVersion: number;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ip: string;

  @ManyToOne(() => PaymentManagement)
  @JoinColumn({ name: 'paymentManagementId' })
  paymentManagement: string | PaymentManagement;

  @ManyToOne(() => ScreenTracking)
  @JoinColumn({ name: 'screenTrackingId' })
  screenTracking: string | ScreenTracking;

  @Column()
  signedAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
