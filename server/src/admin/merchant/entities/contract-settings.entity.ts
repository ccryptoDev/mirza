import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'merchant_contract_settings' })
export class ContractSettings {
  @Column({ type: 'double precision' })
  APRReductionRate: number;

  @Column({ type: 'double precision' })
  contractSellAmount: number;

  @Column({ type: 'double precision' })
  contractSellerFee: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'double precision' })
  feeReductionRate: number;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  saasFee: boolean;

  @Column({ type: 'double precision', nullable: true })
  saasFeeAmount: number;

  @Column({ nullable: true })
  saasFeePaymentDay: string;

  @Column({ default: false })
  separateTransactions: boolean;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
