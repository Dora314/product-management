// backend/src/product/product.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, ValidationPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseResponseDto } from '../common/dtos/base-reponse.dto'; // Corrected import path
import { Product } from './entities/product.entity';
import { ProductQueryDto } from './dto/product-query.dto'; // Import ProductQueryDto
import { UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common'; // Import các decorators và pipes cần thiết
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'; // Import diskStorage engine của multer
import { extname } from 'path'; // Import extname để lấy extension file

@Controller('products') // Base route path là /products
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

  // 6. Upload ảnh sản phẩm (POST /products/upload)
  @Post('upload') // Endpoint path là /products/upload
  @UseInterceptors(FileInterceptor('image', { // 'image' là field name trong form-data
      storage: diskStorage({ // Cấu hình disk storage engine của multer
          destination: './uploads/products', // Thư mục lưu trữ file upload (tạo thư mục này trong backend project)
          filename: (req, file, cb) => { // Hàm đặt tên file
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Tạo suffix ngẫu nhiên để đảm bảo tên file là unique
              const ext = extname(file.originalname); // Lấy extension file gốc
              const filename = `product-image-${uniqueSuffix}${ext}`; // Tạo tên file mới
              cb(null, filename); // Gọi callback với tên file mới
          },
      }),
      fileFilter: (req, file, cb) => { // Hàm filter file (chọn loại file được phép upload)
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { // Kiểm tra extension file
              return cb(new Error('Chỉ cho phép upload file ảnh (jpg, jpeg, png, gif)!'), false); // Báo lỗi nếu không phải file ảnh
          }
          cb(null, true); // Cho phép upload file
      },
  }))
  async uploadProductImage(
      @UploadedFile( // Decorator để lấy file đã upload
          new ParseFilePipe({ // Pipe để validate file
              validators: [
                  new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // Giới hạn kích thước file: 5MB
                  new FileTypeValidator({ fileType: '.(png|jpg|jpeg|gif)' }), // Giới hạn loại file: png, jpg, jpeg, gif
              ],
          }),
      ) image: Express.Multer.File, // Type của file upload là Express.Multer.File
  ): Promise<BaseResponseDto<{ imageUrl: string }>> {
      const imageUrl = `/uploads/products/${image.filename}`; // Đường dẫn ảnh sau khi upload (lưu ý: đường dẫn này là relative path từ thư mục public nếu bạn serve static files)
      return new BaseResponseDto<{ imageUrl: string }>(201, 'Upload ảnh thành công', { imageUrl }); // Trả về response thành công với đường dẫn ảnh
  }
}