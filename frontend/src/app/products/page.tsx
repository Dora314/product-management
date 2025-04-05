// src/app/products/page.tsx hoặc app/products/page.tsx
'use client'; // Đánh dấu đây là Client Component vì dùng useState, useEffect

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { getProducts } from '../../utils/api'; // Import hàm gọi API
import { Product } from '../../types/product'; // Import kiểu Product (sẽ tạo ở bước sau)

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);

  // Hàm để fetch sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // **LƯU Ý:** Hiện tại chưa có login, nên sẽ gọi API public (nếu có) hoặc bị lỗi 401 nếu API private
      // TODO: Thêm logic kiểm tra login và lấy token trước khi gọi API private
      const data = await getProducts(); // Gọi API lấy sản phẩm
      if (data && data.items) {
        setProducts(data.items);
        setTotalProducts(data.total || data.items.length); // Lấy tổng số sản phẩm
      } else {
         setProducts([]);
         setTotalProducts(0);
      }
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError(err.message || 'Không thể tải danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm fetchProducts khi component mount lần đầu
  useEffect(() => {
    fetchProducts();
  }, []);

  // Xử lý hiển thị trạng thái loading
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Xử lý hiển thị lỗi
  if (error) {
    return (
      <Container>
         <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
         {/* Có thể thêm nút thử lại */}
         <Button variant="contained" onClick={fetchProducts} sx={{ mt: 1 }}>Thử lại</Button>
      </Container>
    );
  }

  // Hàm lấy URL đầy đủ của ảnh
  const getImageUrl = (relativePath?: string): string => {
      if (!relativePath) {
          // Trả về ảnh placeholder hoặc không hiển thị ảnh
          return '/placeholder-image.png'; // Ví dụ: đặt placeholder trong public/
      }
      // Đảm bảo không có dấu / thừa
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');
      const imagePath = relativePath.replace(/^\//, '');
      return `${backendUrl}/${imagePath}`;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Danh sách Sản phẩm ({totalProducts})
      </Typography>

      {/* TODO: Thêm nút Tạo Sản Phẩm Mới */}
      {/* <Button variant="contained" color="primary" sx={{ mb: 2 }}>
         Tạo sản phẩm mới
      </Button> */}

      {/* TODO: Thêm các bộ lọc, sắp xếp, phân trang */}

      <Grid container spacing={3}>
        {products.length > 0 ? (
          products.map((product) => (
            <Grid item={true} key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  sx={{
                      // Chiều cao cố định hoặc tỷ lệ aspect-ratio
                      // height: 140,
                      aspectRatio: '1 / 1', // Tỷ lệ 1:1
                      objectFit: 'contain', // Chứa vừa ảnh, không cắt xén
                      p: 1 // Thêm padding nếu muốn
                  }}
                  image={getImageUrl(product.imageUrl)}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3, // Giới hạn 3 dòng
                  }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Giá: ${Number(product.price).toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  {/* TODO: Thêm Link đến trang chi tiết */}
                  <Button size="small">Xem</Button>
                  {/* TODO: Thêm nút Sửa, Xóa (cần kiểm tra quyền) */}
                  <Button size="small">Sửa</Button>
                  <Button size="small" color="error">Xóa</Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item={true} xs={12}>
             <Typography sx={{ textAlign: 'center', mt: 4 }}>Không có sản phẩm nào.</Typography>
          </Grid>
        )}
      </Grid>

        {/* TODO: Thêm component phân trang */}
    </Container>
  );
};

export default ProductsPage;