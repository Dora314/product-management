// backend/src/product/product.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, ValidationPipe, Query, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // **QUAN TRỌNG:** Import FileInterceptor từ @nestjs/platform-express
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseResponseDto } from '../common/dtos/base-reponse.dto'; // Corrected import path
import { Product } from './entities/product.entity';
import { ProductQueryDto } from './dto/product-query.dto'; // Import ProductQueryDto
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import JwtAuthGuard
import { diskStorage } from 'multer'; // Import diskStorage từ multer
import { extname } from 'path'; // Import extname từ path (Node.js built-in)

@Controller('products') // Base route path là /products
// @UseGuards(JwtAuthGuard) // **ÁP DỤNG JWT AUTH GUARD CHO TOÀN BỘ CONTROLLER**
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
  @UseInterceptors(FileInterceptor('image', { // 'image' là field name client gửi lên
      storage: diskStorage({ // Cấu hình lưu file vào disk
          destination: './uploads/products', // Thư mục đích
          filename: (req, file, cb) => { // Hàm tạo tên file
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              const ext = extname(file.originalname); // Lấy đuôi file
              const filename = `product-image-${uniqueSuffix}${ext}`; // Tạo tên file unique
              cb(null, filename); // Gọi callback với tên file
          },
      }),
      fileFilter: (req, file, cb) => { // Lọc loại file
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) { // Chỉ cho phép ảnh (không phân biệt hoa thường)
              return cb(new Error('Chỉ cho phép upload file ảnh (jpg, jpeg, png, gif)!'), false);
          }
          cb(null, true); // Chấp nhận file
      },
  }))
  async uploadProductImage(
      @UploadedFile( // Decorator lấy file đã upload
          new ParseFilePipe({ // Pipe để validate file
              validators: [
                  new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // Giới hạn 5MB
                  // Bạn có thể bỏ FileTypeValidator ở đây vì đã có fileFilter,
                  // nhưng để chắc chắn hơn thì vẫn nên giữ lại.
                  new FileTypeValidator({ fileType: '.(png|jpg|jpeg|gif)' }),
              ],
          }),
      ) image: Express.Multer.File, // Type của file là Express.Multer.File
  ): Promise<BaseResponseDto<{ imageUrl: string }>> {
      if (!image) {
          // Xử lý trường hợp không có file nào được upload (mặc dù Interceptor thường sẽ chặn)
          // Bạn có thể throw lỗi BadRequestException ở đây nếu muốn
          // throw new BadRequestException('Không có file nào được upload.');
          // Hoặc trả về lỗi theo format BaseResponseDto
          return new BaseResponseDto<{ imageUrl: string }>(400, 'Không có file nào được upload.', null, 'Không có file nào được upload.');
      }

      // Tạo đường dẫn URL cho ảnh (relative path)
      const imageUrl = `/uploads/products/${image.filename}`;

      // Trả về response thành công với đường dẫn ảnh
      return new BaseResponseDto<{ imageUrl: string }>(201, 'Upload ảnh thành công', { imageUrl });
    }
}