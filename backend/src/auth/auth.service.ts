// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { AppConfigService } from '../config/config.service'; // Import ConfigService

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService, // Inject JwtService
    private configService: AppConfigService, // Inject ConfigService
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;

    // **Chú ý: Đây chỉ là ví dụ đơn giản cho mục đích demo. Trong thực tế, bạn cần:**
    // 1. Lấy user từ database dựa trên username.
    // 2. So sánh password đã hash (KHÔNG BAO GIỜ lưu password plaintext trong database).
    // 3. Sử dụng thư viện bcrypt hoặc password hashing algorithm mạnh mẽ khác.

    // **Ví dụ đơn giản: Xác thực cứng (KHÔNG DÙNG TRONG PRODUCTION)**
    if (username !== 'testuser' || password !== 'password123') {
      throw new UnauthorizedException('Invalid credentials'); // Nếu username/password không đúng, throw lỗi Unauthorized
    }

    const payload = { username: username, sub: 1 }; // sub (subject) thường là user ID
    const secret = this.configService.get('JWT_SECRET'); // Lấy JWT secret key từ config
    const accessToken = await this.jwtService.signAsync(payload, { secret }); // Tạo JWT token

    return { accessToken }; // Trả về access token
  }
}