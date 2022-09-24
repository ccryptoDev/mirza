import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ScreenTracking } from '../../../user/screen-tracking/entities/screen-tracking.entity';

@Entity()
export class Comments {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: string;

  @Column()
  comment: string;

  @Column()
  createdBy: string;

  @ManyToOne(() => ScreenTracking)
  @JoinColumn({ name: 'screenTrackingId' })
  screenTracking: string | ScreenTracking;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
