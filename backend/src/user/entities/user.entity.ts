// backend/src/user/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // Tên bảng trong database sẽ là 'users'
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true }) // Username phải là duy nhất
  username!: string;

  @Column() // Lưu password đã được hash
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}