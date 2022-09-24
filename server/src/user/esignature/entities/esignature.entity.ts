import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../entities/user.entity';
import { UserConsent } from '../../consent/entities/consent.entity';
import { ScreenTracking } from '../../screen-tracking/entities/screen-tracking.entity';

@Entity({ name: 'esignature' })
export class ESignature {
  @OneToOne(() => UserConsent)
  @JoinColumn({ name: 'consentId' })
  consent: string | UserConsent;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  device: string;

  @Column()
  fullName: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ipAddress: string;

  @OneToOne(() => ScreenTracking)
  @JoinColumn({ name: 'screenTrackingId' })
  screenTracking: string | ScreenTracking;

  @Column()
  signature: string;

  @Column()
  signaturePath: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: string | User;
}
