import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Roles } from '../../../authentication/roles/entities/roles.entity';
import { User } from '../../entities/user.entity';

@Entity()
export class UserDocuments {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  driversLicense: { front: string; back: string };

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  passport: string;

  @Column()
  uploaderId: string;

  @Column()
  uploaderName: string;

  @Column({
    type: 'enum',
    enum: ['Manager', 'Super Admin', 'User', 'Merchant Staff'],
  })
  uploaderRole: Roles['roleName'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: string | User;
}
