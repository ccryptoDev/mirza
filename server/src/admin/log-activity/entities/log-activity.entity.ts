import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Admin } from '../../entities/admin.entity';

@Entity()
export class LogActivity {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  moduleName?: string;

  @Column()
  requestUri: string;

  @Column()
  message: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ip: string;

  @Column({ nullable: true })
  loanReference?: string;

  @Column()
  logReference: string;

  @Column({ nullable: true })
  screenTrackingId?: string;

  @Column({ nullable: true })
  paymentManagementId?: string;

  @Column({ nullable: true })
  merchantId?: string;

  @Column({ nullable: true })
  jsonData?: string;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'userId' })
  userId: string | Admin;
}
