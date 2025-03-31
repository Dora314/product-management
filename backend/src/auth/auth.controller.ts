// backend/src/auth/auth.controller.ts
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { BaseResponseDto } from '../common/dtos/base-reponse.dto'; // Import BaseResponseDto

@Controller('auth') // Base route path là /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 1. Login API (POST /auth/login)
  @Post('login') // Endpoint path là /auth/login
  async login(@Body(new ValidationPipe()) loginDto: LoginDto): Promise<BaseResponseDto<{ accessToken: string }>> {
    const { accessToken } = await this.authService.login(loginDto);
    return new BaseResponseDto<{ accessToken: string }>(200, 'Đăng nhập thành công', { accessToken }); // Sử dụng BaseResponseDto
  }
}