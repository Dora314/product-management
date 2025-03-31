import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppConfigModule } from '../config/config.module'; // Sửa ở đây: bỏ .ts
import { AppConfigService } from '../config/config.service'; // Sửa ở đây: bỏ .ts
import { DataSourceConfig } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => ({
        ...DataSourceConfig,
        autoLoadEntities: true,
        synchronize: configService.isDevelopment(),
      }),
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return await new DataSource(options).initialize();
      },
    }),
  ],
})
export class DatabaseModule {}