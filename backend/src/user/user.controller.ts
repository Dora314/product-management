// backend/src/user/user.controller.ts
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { BaseResponseDto } from '../common/dtos/base-reponse.dto';
import { User } from './entities/user.entity';

@Controller('users') // Base route path là /users
export class UserController {
  constructor(private readonly userService: UserService) {}

  // API Register (POST /users/register)
  @Post('register')
  async register(
    @Body(new ValidationPipe()) registerDto: RegisterDto,
  ): Promise<BaseResponseDto<User>> {
    const user = await this.userService.create(registerDto);
    return new BaseResponseDto<User>(201, 'Đăng ký thành công', user); // Trả về user không có password
  }
}