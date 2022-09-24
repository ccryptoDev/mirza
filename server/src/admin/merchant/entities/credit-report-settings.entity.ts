import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'merchant_credit_report_settings' })
export class CreditReportSettings {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  industryCode: string;

  @Column()
  memberCode: string;

  @Column()
  password: string;

  @Column()
  prefixCode: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
