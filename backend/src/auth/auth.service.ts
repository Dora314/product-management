// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../config/config.service';
import { UserService } from '../user/user.service'; // Import UserService
import * as bcrypt from 'bcrypt'; // Import bcrypt

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: AppConfigService,
    private userService: UserService, // Inject UserService
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;

    // 1. Tìm user theo username
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // Không tìm thấy user
    }

    // 2. So sánh password
    const isPasswordMatching = await bcrypt.compare(password, user.password); // So sánh password nhập vào với password đã hash
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials'); // Password không khớp
    }

    // 3. Tạo JWT token
    const payload = { username: user.username, sub: user.id }; // Sử dụng user.id thực tế
    const secret = this.configService.get('JWT_SECRET');
    const accessToken = await this.jwtService.signAsync(payload, { secret });

    return { accessToken };
  }
}