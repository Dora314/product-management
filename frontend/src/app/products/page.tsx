// src/app/products/page.tsx hoặc app/products/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid, // Import Grid
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { getProducts } from '../../utils/api';
import { Product } from '../../types/product';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Add authentication logic if needed
      const data = await getProducts();
      if (data && data.items) {
        setProducts(data.items);
        setTotalProducts(data.total || data.items.length);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
         <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
         <Button variant="contained" onClick={fetchProducts} sx={{ mt: 1 }}>Thử lại</Button>
      </Container>
    );
  }

  const getImageUrl = (relativePath?: string): string => {
      if (!relativePath) {
          return '/placeholder-image.png';
      }
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');
      const imagePath = relativePath.replace(/^\//, '');
      return `${backendUrl}/${imagePath}`;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Danh sách Sản phẩm ({totalProducts})
      </Typography>

      <Grid container spacing={3}> {/* Grid container */}
        {products.length > 0 ? (
          products.map((product) => (
            // --- SỬA Ở ĐÂY: Bỏ prop 'item' ---
            <Grid component="div" key={product.id} xs={12} sm={6} md={4} lg={3}> {/* Grid item: đặt xs, sm, md, lg trực tiếp */}
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  sx={{
                      aspectRatio: '1 / 1',
                      objectFit: 'contain',
                      p: 1
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
                      WebkitLineClamp: 3,
                  }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Giá: ${product.price ? product.price.toFixed(2) : 'N/A'} {/* Thêm kiểm tra price tồn tại */}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Xem</Button>
                  <Button size="small">Sửa</Button>
                  <Button size="small" color="error">Xóa</Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          // --- SỬA Ở ĐÂY: Bỏ prop 'item' nếu có ---
          <Grid xs={12}> {/* Grid cho thông báo rỗng */}
             <Typography sx={{ textAlign: 'center', mt: 4 }}>Không có sản phẩm nào.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ProductsPage;