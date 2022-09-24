import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../../entities/user.entity';

@Entity({ name: 'user_accounts' })
export class Accounts {
  @Column()
  accountHolder: string;

  @Column()
  accountNumber: string;

  @Column()
  bankName: string;

  @Column({ nullable: true })
  bankAddress: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isDefaultPaymentMethod: boolean;

  @ManyToOne((): typeof User => User, (user: User): Accounts => user.accounts)
  user: User | string;

  @Column()
  routingNumber: string;

  @Column()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
