import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Load .env file

export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres', // Hoặc 'mysql', 'sqlite', ... tùy bạn chọn
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'product_management',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Đường dẫn đến các Entity files
  synchronize: process.env.NODE_ENV === 'development', // Chỉ synchronize ở môi trường dev
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'], // Đường dẫn đến các Migration files (nếu dùng migrations)
};

export default DataSourceConfig;