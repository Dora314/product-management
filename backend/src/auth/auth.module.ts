// backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module'; // Import UserModule

@Module({
  imports: [
    AppConfigModule,
    UserModule, // **THÊM UserModule VÀO IMPORTS ĐÂY**
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}