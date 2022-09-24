import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../../entities/user.entity';

@Entity({ name: 'user_cards' })
export class Cards {
  @Column()
  billingAddress: string;

  @Column()
  billingCity: string;

  @Column()
  billingFirstName: string;

  @Column()
  billingLastName: string;

  @Column()
  billingState: string;

  @Column()
  billingZip: string;

  @Column()
  cardholderName: string;

  @Column()
  cardNumberLastFourDigits: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  customerVaultId: string;

  @Column()
  cvv: string;

  @Column()
  expirationMonth: string;

  @Column()
  expirationYear: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isDefaultPaymentMethod: boolean;

  @ManyToOne(() => User, (user) => user.cards)
  user: User | string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
