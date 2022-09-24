import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Merchant } from '../../../../admin/merchant/entities/merchant.entity';

@Entity()
export class ApplicationLink {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isBackendApplication: boolean;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @ManyToOne(() => Merchant)
  @JoinColumn({ name: 'merchantId' })
  merchant: string | Merchant;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
