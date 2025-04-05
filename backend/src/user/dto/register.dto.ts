// backend/src/user/dto/register.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4) // Yêu cầu username tối thiểu 4 ký tự (tùy chỉnh)
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6) // Yêu cầu password tối thiểu 6 ký tự (tùy chỉnh)
  password!: string;

  // Bạn có thể thêm trường `confirmPassword` và validation nếu muốn
  // @IsString()
  // @IsNotEmpty()
  // @Match('password', { message: 'Passwords do not match' }) // Cần cài đặt class-validator-extended
  // confirmPassword?: string;
}