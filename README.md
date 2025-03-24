# My name is Hoang Thien Duy 

# Hệ thống Quản lý Sản phẩm - Product Management System (NestJS & Next.js)

## Mô tả dự án

Đây là một project full-stack đơn giản để quản lý sản phẩm, được xây dựng bằng NestJS cho backend và Next.js cho frontend, sử dụng TypeScript. Dự án cung cấp các chức năng CRUD (Tạo, Đọc, Cập nhật, Xóa) sản phẩm, cùng với các tính năng tìm kiếm, sắp xếp, phân trang, upload ảnh và xác thực người dùng.

## Công nghệ sử dụng

*   **Backend:**
    *   [NestJS](https://nestjs.com/) - Framework backend Node.js mạnh mẽ
    *   [TypeScript](https://www.typescriptlang.org/) - Ngôn ngữ lập trình
    *   [TypeORM](https://typeorm.io/) - ORM cho TypeScript và JavaScript
    *   [PostgreSQL](https://www.postgresql.org/) (hoặc cơ sở dữ liệu bạn chọn) - Hệ quản trị cơ sở dữ liệu
    *   [JWT (JSON Web Token)](https://jwt.io/) - Xác thực và ủy quyền API
*   **Frontend:**
    *   [Next.js](https://nextjs.org/) - Framework React cho ứng dụng web
    *   [TypeScript](https://www.typescriptlang.org/) - Ngôn ngữ lập trình
    *   [React](https://reactjs.org/) - Thư viện JavaScript cho giao diện người dùng
    *   [Axios](https://axios-http.com/) (hoặc Fetch API) - HTTP client để gọi API backend

## Cấu trúc dự án


product-management-app/

├── backend/ # NestJS Backend

│ ├── src/ # Mã nguồn Backend

│ │ ├── app.module.ts

│ │ ├── auth/ # Module Xác thực

│ │ ├── product/ # Module Sản phẩm

│ │ ├── common/ # Module Common

│ │ ├── config/ # Module Config

│ │ ├── database/ # Module Database

│ │ ├── main.ts

│ │ └── ...

│ ├── test/

│ ├── package.json

│ ├── tsconfig.json

│ └── nest-cli.json

├── frontend/ # Next.js Frontend

│ ├── pages/ # Routes của Next.js

│ │ ├── index.tsx

│ │ ├── login.tsx

│ │ ├── products/

│ │ │ ├── index.tsx

│ │ │ ├── [id].tsx

│ │ │ ├── create.tsx

│ │ │ └── edit/[id].tsx

│ │ ├── _app.tsx

│ │ └── _document.tsx

│ ├── components/ # Components React

│ ├── public/

│ ├── styles/

│ ├── utils/ # Utility functions

│ ├── contexts/ # React Contexts

│ ├── hooks/ # React Hooks

│ ├── types/ # TypeScript types

│ ├── package.json

│ ├── tsconfig.json

│ └── next.config.js

├── package.json # Root package.json

├── README.md

└── .gitignore

## Cài đặt và chạy dự án

1.  **Clone repository:**

    ```bash
    git clone [URL_REPOSITORY_CỦA_BẠN]
    cd product-management-app
    ```

2.  **Cài đặt dependencies (cho cả backend và frontend):**

    ```bash
    npm install
    cd backend
    npm install
    cd ../frontend
    npm install
    cd .. # Quay lại thư mục gốc
    ```

3.  **Cấu hình Backend:**
    *   Sao chép file `.env.example` trong thư mục `backend` thành `.env` và điền thông tin cấu hình cơ sở dữ liệu, JWT secret, v.v.
    *   Đảm bảo bạn đã cài đặt và cấu hình cơ sở dữ liệu PostgreSQL (hoặc cơ sở dữ liệu bạn chọn).
    *   Chạy migrations (nếu có cấu hình TypeORM migrations):

        ```bash
        cd backend
        npm run typeorm migration:run
        cd .. # Quay lại thư mục gốc
        ```

4.  **Chạy Backend:**

    ```bash
    npm run backend:dev
    ```
    Backend sẽ chạy ở `http://localhost:3000`.

5.  **Chạy Frontend:**

    ```bash
    npm run frontend:dev
    ```
    Frontend sẽ chạy ở `http://localhost:3001`.

6.  **Truy cập ứng dụng:**
    Mở trình duyệt và truy cập `http://localhost:3001`.

## Tính năng chính

*   **Quản lý sản phẩm:**
    *   Thêm, xem, sửa, xóa sản phẩm.
    *   Tìm kiếm sản phẩm theo tên và mô tả.
    *   Sắp xếp sản phẩm theo tên, giá, ngày tạo.
    *   Phân trang danh sách sản phẩm.
    *   Upload ảnh sản phẩm.
*   **Xác thực người dùng:**
    *   Đăng nhập/Đăng xuất sử dụng JWT.
    *   API private được bảo vệ, yêu cầu xác thực JWT.
*   **API Public và Private:**
    *   API Public: `POST /auth/login` (Đăng nhập).
    *   API Private (yêu cầu JWT): Tất cả các API liên quan đến sản phẩm (`/products`).
*   **Cấu trúc Response nhất quán:** Sử dụng `BaseResponseDto` cho tất cả API responses.

## API Endpoints

**Public APIs:**

*   `POST /auth/login`: Đăng nhập hệ thống.

**Private APIs (Yêu cầu JWT token trong header `Authorization: Bearer <token>`):**

*   **Sản phẩm (`/products`)**
    *   `POST /products`: Thêm sản phẩm mới.
    *   `GET /products`: Lấy danh sách sản phẩm (hỗ trợ tìm kiếm, sắp xếp, phân trang qua query parameters).
    *   `GET /products/:id`: Xem chi tiết sản phẩm theo ID.
    *   `PUT /products/:id`: Cập nhật thông tin sản phẩm theo ID.
    *   `DELETE /products/:id`: Xóa sản phẩm theo ID.
    *   `POST /products/upload`: Upload ảnh sản phẩm (field name là `image`).

## Cấu trúc Request/Response (Ví dụ)

**Request (Thêm sản phẩm - `POST /products`):**

```json
{
  "name": "Sản phẩm mới",
  "description": "Mô tả sản phẩm mới",
  "price": 150.00
}

Response thành công (Lấy danh sách sản phẩm - GET /products):

{
  "statusCode": 200,
  "message": "Lấy danh sách sản phẩm thành công",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Sản phẩm 1",
        "description": "Mô tả sản phẩm 1",
        "price": 100.00,
        "imageUrl": "/uploads/products/product-image-1678886400000-123456789.png",
        "createdAt": "2023-03-15T10:00:00.000Z",
        "updatedAt": "2023-03-15T10:00:00.000Z"
      },
      // ... các sản phẩm khác ...
    ],
    "total": 100 // Tổng số sản phẩm
  },
  "error": null
}

Response lỗi (Validate lỗi - POST /products):

{
  "statusCode": 400,
  "message": "Lỗi validate dữ liệu",
  "data": null,
  "error": "Tên sản phẩm không được để trống"
}
```

**Dữ liệu mẫu:**
```json
// backend/src/product/entities/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ nullable: true }) // Có thể null nếu chưa upload ảnh
  imageUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
```

## Các bước phát triển tiếp theo (Future Enhancements)

Thêm chức năng phân quyền người dùng (Roles and Permissions).

Cải thiện giao diện người dùng, thêm nhiều tính năng frontend.

Viết unit tests và e2e tests cho backend.

Triển khai ứng dụng lên môi trường production (ví dụ: Docker, AWS, Vercel, Netlify).

... (Còn nữa) ...

## Cảm ơn thầy đã đến với project của em!
