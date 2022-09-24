import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Roles {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['Manager', 'Merchant', 'Super Admin', 'User', 'Merchant Staff'],
  })
  roleName: 'Manager' | 'Merchant' | 'Super Admin' | 'User' | 'Merchant Staff';

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
