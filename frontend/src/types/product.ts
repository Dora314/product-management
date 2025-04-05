// src/types/product.ts hoặc types/product.ts
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string; // imageUrl là optional
    createdAt: string; // Hoặc Date nếu bạn parse date
    updatedAt: string; // Hoặc Date
  }