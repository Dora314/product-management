// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Import nếu bạn dùng global pipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // **BẬT CORS Ở ĐÂY**
  app.enableCors({
    origin: 'http://localhost:3001', // Cho phép origin của frontend Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các method được phép
    credentials: true, // Nếu bạn cần gửi cookie hoặc authorization headers
    // Bạn có thể cấu hình chi tiết hơn nếu cần
    // origin: true, // Cho phép tất cả origin (Cẩn thận khi dùng trong production)
  });

  // (Tùy chọn) Nếu bạn muốn dùng ValidationPipe global
  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000); // Hoặc port của backend
}
bootstrap();