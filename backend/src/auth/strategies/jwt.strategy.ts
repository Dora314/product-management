// backend/src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../../config/config.service'; // Import ConfigService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy JWT token từ header Authorization (Bearer token)
      ignoreExpiration: false, // Không ignore token expiration (Passport sẽ tự động kiểm tra expiration)
      secretOrKey: configService.get('JWT_SECRET'), // Secret key để verify token (lấy từ ConfigService)
    });
  }

  async validate(payload: any): Promise<any> {
    // Payload ở đây là kết quả giải mã JWT token.
    // Trong ví dụ của chúng ta, payload chứa { username: 'testuser', sub: 1 } (trong AuthService.login)
    // Bạn có thể thêm logic để validate user dựa trên payload, ví dụ:
    // - Tìm user trong database dựa trên payload.sub (user ID)
    // - Kiểm tra xem user có quyền truy cập API hay không (nếu cần phân quyền)
    // - ...

    // **Ví dụ đơn giản: Trả về payload để NestJS gán vào `request.user` **
    return payload;
  }
}