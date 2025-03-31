// backend/src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto'; // Import DTO
import { UpdateProductDto } from './dto/update-product.dto'; // Import DTO
import { ProductQueryDto, SortOrder } from './dto/product-query.dto'; // Import ProductQueryDto và SortOrder

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

  async findAll(query: ProductQueryDto): Promise<{ items: Product[]; total: number }> {
    const { search, sortBy, sortOrder, page, pageSize } = query;
    const queryBuilder = this.productRepository.createQueryBuilder('product'); // Tạo query builder

    // 1. Tìm kiếm (Search)
    if (search) {
      queryBuilder.where(
        '(product.name ILIKE :search OR product.description ILIKE :search)', // Tìm kiếm gần đúng (ILIKE) không phân biệt hoa thường
        { search: `%${search}%` }, // %${search}% để tìm kiếm chứa từ khóa
      );
    }

    // 2. Sắp xếp (Sort)
    const actualSortBy = sortBy || 'createdAt'; // Mặc định sắp xếp theo createdAt nếu không có sortBy
    const actualSortOrder: SortOrder = sortOrder === SortOrder.DESC ? SortOrder.DESC : SortOrder.ASC; // Mặc định ASC nếu không có sortOrder
    queryBuilder.orderBy(`product.${actualSortBy}`, actualSortOrder === SortOrder.DESC ? 'DESC' : 'ASC');

    // 3. Phân trang (Pagination)
    const actualPage = Number(page) || 1; // Mặc định trang 1 nếu không có page
    const actualPageSize = Number(pageSize) || 10; // Mặc định 10 sản phẩm/trang nếu không có pageSize
    const skip = (actualPage - 1) * actualPageSize; // Tính số bản ghi bỏ qua
    queryBuilder.skip(skip).take(actualPageSize); // Giới hạn số bản ghi lấy ra

    const [items, total] = await queryBuilder.getManyAndCount(); // Lấy danh sách sản phẩm và tổng số lượng
    return { items, total };
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