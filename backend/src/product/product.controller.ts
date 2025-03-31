// backend/src/product/product.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, ValidationPipe, Query, UseGuards} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseResponseDto } from '../common/dtos/base-reponse.dto'; // Corrected import path
import { Product } from './entities/product.entity';
import { ProductQueryDto } from './dto/product-query.dto'; // Import ProductQueryDto
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import JwtAuthGuard

@Controller('products') // Base route path là /products
@UseGuards(JwtAuthGuard) // **ÁP DỤNG JWT AUTH GUARD CHO TOÀN BỘ CONTROLLER**
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 1. Tạo sản phẩm (POST /products)
  @Post()
  async createProduct(
    @Body(new ValidationPipe()) createProductDto: CreateProductDto, // Sử dụng ValidationPipe để validate request body
  ): Promise<BaseResponseDto<Product>> {
    const product = await this.productService.create(createProductDto);
    return new BaseResponseDto<Product>(201, 'Tạo sản phẩm thành công', product); // Sử dụng BaseResponseDto
  }

  // 2. Lấy danh sách sản phẩm (GET /products) - Có tìm kiếm, sắp xếp, phân trang
  @Get()
  async getProducts(
    @Query(new ValidationPipe()) query: ProductQueryDto, // Sử dụng @Query và ValidationPipe để validate query params
  ): Promise<BaseResponseDto<{ items: Product[]; total: number }>> {
    const { items, total } = await this.productService.findAll(query); // Truyền ProductQueryDto vào service
    return new BaseResponseDto<{ items: Product[]; total: number }>(200, 'Lấy danh sách sản phẩm thành công', { items, total });
  }

  // 3. Lấy sản phẩm theo ID (GET /products/:id)
  @Get(':id')
  async getProductById(
    @Param('id', ParseIntPipe) id: number, // ParseIntPipe để validate và convert param 'id' sang number
  ): Promise<BaseResponseDto<Product>> {
    const product = await this.productService.findOne(id);
    if (!product) {
      // Xử lý nếu không tìm thấy sản phẩm (ví dụ: trả về 404 Not Found) - sẽ cải thiện sau
      return new BaseResponseDto<Product>(404, 'Không tìm thấy sản phẩm', null);
    }
    return new BaseResponseDto<Product>(200, 'Lấy sản phẩm thành công', product); // Sử dụng BaseResponseDto
  }

  // 4. Cập nhật sản phẩm (PUT /products/:id)
  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateProductDto: UpdateProductDto, // Validate body khi update
  ): Promise<BaseResponseDto<Product>> {
    const product = await this.productService.update(id, updateProductDto);
    if (!product) {
      return new BaseResponseDto<Product>(404, 'Không tìm thấy sản phẩm để cập nhật', null);
    }
    return new BaseResponseDto<Product>(200, 'Cập nhật sản phẩm thành công', product); // Sử dụng BaseResponseDto
  }

  // 5. Xóa sản phẩm (DELETE /products/:id)
  @Delete(':id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponseDto<void>> {
    await this.productService.remove(id);
    return new BaseResponseDto<void>(200, 'Xóa sản phẩm thành công'); // Sử dụng BaseResponseDto
  }
}