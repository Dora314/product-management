// backend/src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Đăng ký User entity
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // **Export UserService để AuthModule có thể sử dụng**
})
export class UserModule {}