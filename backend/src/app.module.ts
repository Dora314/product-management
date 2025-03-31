// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AppConfigModule } from './config/config.module';
import { ProductModule } from './product/product.module'; // Import ProductModule

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    ProductModule, // Thêm ProductModule vào imports
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}