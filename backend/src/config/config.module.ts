import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Sửa ở đây: bỏ .ts
import { AppConfigService } from './config.service'; // Sửa ở đây: bỏ .ts

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}