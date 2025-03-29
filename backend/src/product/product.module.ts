// backend/src/product/product.module.ts
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // Đăng ký Product entity ở đây
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}