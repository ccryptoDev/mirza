import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { ContractSettings } from './contract-settings.entity';
import { CreditReportSettings } from './credit-report-settings.entity';
import { Terms } from './terms.entity';
import { Accounts } from './accounts.entity';
import { Cards } from './cards.entity';
import { LoanSettings } from './loan-settings.entity';

@Entity()
export class Merchant {
  @OneToMany((): typeof Accounts => Accounts, (accounts) => accounts.merchant)
  accounts: Accounts;

  @Column()
  address: string;

  @Column({ type: 'enum', enum: ['merchant onboarding', 'admin dashboard'] })
  applicationSource: 'merchant onboarding' | 'admin dashboard';

  @OneToMany((): typeof Cards => Cards, (cards) => cards.merchant)
  cards: Cards;

  @Column()
  city: string;

  @OneToOne((): typeof ContractSettings => ContractSettings)
  @JoinColumn({ name: 'contractSettingsId' })
  contractSettings: string | ContractSettings;

  @OneToOne((): typeof CreditReportSettings => CreditReportSettings)
  @JoinColumn({ name: 'creditReportSettingsId' })
  creditReportSettings: string | CreditReportSettings;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  contactName: string;

  @Column()
  email: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToOne((): typeof LoanSettings => LoanSettings)
  @JoinColumn({ name: 'loanSettingsId' })
  loanSettings: string | LoanSettings;

  @Column({ nullable: true })
  businessCategory?: string;

  @Column()
  phone: string;

  @Column()
  name: string;

  @Column()
  stateCode: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column()
  url: string;

  @OneToOne((): typeof Terms => Terms)
  @JoinColumn({ name: 'termsId' })
  terms: Terms;

  @Column({ nullable: true })
  website?: string;

  @Column()
  zip: string;
}
