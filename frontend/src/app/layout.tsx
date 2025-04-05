// src/app/layout.tsx hoặc app/layout.tsx
import * as React from 'react';
import ThemeRegistry from '../theme/ThemeRegistry'; // Đường dẫn tới ThemeRegistry

export const metadata = {
  title: 'Quản lý Sản phẩm',
  description: 'Ứng dụng quản lý sản phẩm Next.js và NestJS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry> {/* Bọc children bằng ThemeRegistry */}
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}