import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Child } from '../child/child.entity'; // Импорт сущности Child

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Пароль (предполагается, что он хеширован)

  @OneToMany(() => Child, (child) => child.user)
  children: Child[]; // Связь с детьми

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true, // Указание, что поле является массивом
    default: [UserRole.USER], // По умолчанию обычный пользователь
  })
  roles: UserRole[]; // Роли пользователя как массив

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
