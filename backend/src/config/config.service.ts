import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Sửa ở đây: bỏ .ts

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get(key: string): string {
    return this.configService.getOrThrow<string>(key);
  }

  getNumber(key: string): number {
    return Number(this.configService.getOrThrow<string>(key));
  }

  isDevelopment(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'development';
  }
  // ...
}