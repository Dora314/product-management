// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AppConfigModule } from './config/config.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module'; // Import AuthModule
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    ProductModule,
    AuthModule,
    UserModule, // Thêm AuthModule vào imports
    ServeStaticModule.forRoot({ // Cấu hình serve static files
      rootPath: join(__dirname, '..', '..', 'uploads'), // Đường dẫn đến thư mục gốc 'uploads'
      serveRoot: '/uploads/', // Prefix URL để truy cập (ví dụ: /uploads/products/...)
      // serveStaticOptions: { // Tùy chọn thêm nếu cần
      //   index: false, // Không serve file index.html
      // },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}