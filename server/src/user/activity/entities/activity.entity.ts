import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { ScreenTracking } from '../../screen-tracking/entities/screen-tracking.entity';
import { User } from '../../entities/user.entity';

@Entity()
export class UserActivity {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  description: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column()
  logData: string;

  @OneToOne(() => ScreenTracking)
  @JoinColumn({ name: 'screenTrackingId' })
  screenTracking: string | ScreenTracking;

  @Column()
  status: number;

  @Column()
  subject: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: string | User;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
