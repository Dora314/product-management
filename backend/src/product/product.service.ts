// backend/src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto'; // Import DTO
import { UpdateProductDto } from './dto/update-product.dto'; // Import DTO

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) // Inject Repository<Product>
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto); // Tạo instance Product từ DTO
    return this.productRepository.save(product); // Lưu vào database và trả về Product đã lưu
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find(); // Lấy tất cả sản phẩm
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productRepository.findOneBy({ id }); // Tìm sản phẩm theo ID
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product | null> {
    await this.productRepository.update(id, updateProductDto); // Cập nhật sản phẩm theo ID và DTO
    return this.findOne(id); // Trả về sản phẩm đã cập nhật
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id); // Xóa sản phẩm theo ID
  }
}