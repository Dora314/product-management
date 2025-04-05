// backend/src/product/entities/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products') // Tên bảng trong database sẽ là 'products'
export class Product {
  @PrimaryGeneratedColumn() // Trường primary key, tự động tăng
  id!: number;

  @Column() // Trường thông thường, kiểu dữ liệu mặc định là varchar
  name!: string;

  @Column({ type: 'text' }) // Kiểu text cho mô tả dài
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Kiểu decimal cho giá, precision và scale để định dạng số thập phân
  price!: number;

  @Column({ nullable: true }) // Cho phép null
  imageUrl?: string;

  @CreateDateColumn() // Tự động tạo thời điểm tạo bản ghi
  createdAt!: Date;

  @UpdateDateColumn() // Tự động cập nhật thời điểm cập nhật bản ghi
  updatedAt!: Date;
}