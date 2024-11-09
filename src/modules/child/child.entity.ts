import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ActivityRecord } from '../activityRecord/activity-record.entity'; // Ссылка на `ActivityRecord`

@Entity()
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ nullable: true })
  gender: string; // Можно сделать ENUM, если необходимо, например, 'male', 'female'

  @ManyToOne(() => User, (user) => user.children, { onDelete: 'CASCADE' })
  user: User; // Связь с пользователем (мамой)

  @OneToMany(() => ActivityRecord, (activityRecord) => activityRecord.child)
  activityRecords: ActivityRecord[]; // Связь с активностями ребенка

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
