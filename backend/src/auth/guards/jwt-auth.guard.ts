// backend/src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { // Kế thừa từ AuthGuard('jwt'), 'jwt' là tên của JWT strategy
  canActivate(context: ExecutionContext) {
    // Thêm logic tùy chỉnh nếu cần (ví dụ: kiểm tra roles, permissions...)
    return super.canActivate(context); // Gọi canActivate của AuthGuard('jwt') để thực hiện xác thực JWT
  }
}