import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Counters {
  @Column()
  appType: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sequenceValue: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
