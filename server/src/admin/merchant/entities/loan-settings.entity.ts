import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'merchant_loan_settings' })
export class LoanSettings {
  @Column({ default: false })
  autoDisbursementApproval: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  delinquencyPeriod: number;

  @Column()
  lateFee: number;

  @Column()
  lateFeeGracePeriod: number;

  @Column()
  NSFFee: number;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
