// backend/src/product/dto/update-product.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsOptional() // Tất cả các trường đều optional khi update
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}