import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Child } from '../child/child.entity'; // Предполагается, что у вас есть сущность `Child`

export enum ActivityType {
  FEEDING = 'feeding',
  SLEEP = 'sleep',
  // Можно добавить другие типы активностей, например, 'play', 'measurement'
}

@Entity()
export class ActivityRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Child, (child) => child.activityRecords, {
    onDelete: 'CASCADE',
  })
  child: Child;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  activityType: ActivityType;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ nullable: true })
  amount: number; // Применимо, например, для кормления

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
