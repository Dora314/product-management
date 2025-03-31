// backend/src/product/dto/product-query.dto.ts
import { IsString, IsOptional, IsNumberString, IsEnum } from 'class-validator';

export enum SortOrder { // Enum cho thứ tự sắp xếp
  ASC = 'asc',
  DESC = 'desc',
}

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  search?: string; // Tìm kiếm theo tên hoặc mô tả

  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'price' | 'createdAt'; // Sắp xếp theo trường nào (chỉ cho phép name, price, createdAt)

  @IsOptional()
  @IsEnum(SortOrder) // Validate là giá trị trong enum SortOrder
  sortOrder?: SortOrder; // Thứ tự sắp xếp (asc hoặc desc)

  @IsOptional()
  @IsNumberString() // Validate là string number
  page?: string; // Số trang

  @IsOptional()
  @IsNumberString()
  pageSize?: string; // Số sản phẩm trên mỗi trang
}