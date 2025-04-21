// src/app/(dashboard)/products/[id]/page.tsx
'use client'; // Cần client component để dùng hooks (useState, useEffect, useParams)

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Import useParams để lấy ID từ URL
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardMedia,
    CardContent,
    Box,
    Button,
    Grid,
    Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getProductById } from '@/utils/api'; // Import hàm gọi API
import { Product } from '@/types/product'; // Import kiểu Product

// Hàm lấy URL ảnh (tương tự trang danh sách)
const getImageUrl = (relativePath?: string): string => {
    if (!relativePath) {
        return '/placeholder-image.png'; // Hoặc một ảnh mặc định khác
    }
    const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');
    const imagePath = relativePath.replace(/^\//, '');
    return `${backendUrl}/${imagePath}`;
}

const ProductDetailPage = () => {
    const params = useParams(); // Hook để lấy route parameters
    const router = useRouter(); // Hook để điều hướng
    const id = params?.id as string; // Lấy id từ params, ép kiểu sang string

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Chỉ fetch dữ liệu nếu có id
        if (id) {
            const fetchProductDetail = async () => {
                setLoading(true);
                setError(null);
                try {
                    // **LƯU Ý:** API getProductById cũng cần token nếu backend bảo vệ nó
                    // TODO: Đảm bảo fetchApi gửi token nếu cần
                    const data = await getProductById(id);
                    setProduct(data);
                } catch (err: any) {
                    console.error('Failed to fetch product detail:', err);
                    setError(err.message || `Không thể tải thông tin sản phẩm (ID: ${id}).`);
                } finally {
                    setLoading(false);
                }
            };
            fetchProductDetail();
        } else {
            // Xử lý trường hợp không có id (có thể không bao giờ xảy ra với cấu trúc route này)
            setError('Không tìm thấy ID sản phẩm.');
            setLoading(false);
        }
    }, [id]); // Dependency là id, fetch lại nếu id thay đổi

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                 <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.back()} // Nút quay lại trang trước
                    sx={{ mt: 2 }}
                >
                    Quay lại
                </Button>
            </Container>
        );
    }

    if (!product) {
         return (
            <Container>
                 <Alert severity="warning" sx={{ mt: 2 }}>Không tìm thấy thông tin sản phẩm.</Alert>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.back()}
                    sx={{ mt: 2 }}
                >
                    Quay lại
                </Button>
            </Container>
         );
    }

    // Hiển thị chi tiết sản phẩm
    return (
        <Box>
             <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.back()} // Nút quay lại trang trước
                sx={{ mb: 2 }}
            >
                Quay lại danh sách
            </Button>
            <Card>
                <Grid container spacing={2}>
                     <Grid item xs={12} md={6}>
                        <CardMedia
                            component="img"
                            sx={{
                                width: '100%',
                                maxHeight: 500, // Giới hạn chiều cao ảnh
                                objectFit: 'contain', // Hiển thị vừa vặn
                                p: 2,
                            }}
                            image={getImageUrl(product.imageUrl)}
                            alt={product.name}
                        />
                    </Grid>
                     <Grid item xs={12} md={6}>
                        <CardContent>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {product.name}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h5" color="primary" gutterBottom>
                                Giá: ${Number(product.price).toFixed(2)}
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                                {product.description}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="caption" display="block" color="text.secondary">
                                Tạo lúc: {new Date(product.createdAt).toLocaleString()}
                            </Typography>
                             <Typography variant="caption" display="block" color="text.secondary">
                                Cập nhật lúc: {new Date(product.updatedAt).toLocaleString()}
                            </Typography>
                             {/* TODO: Thêm nút Sửa ở đây */}
                             {/* <Button variant="contained" sx={{mt: 3}}>Sửa sản phẩm</Button> */}
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );
};

export default ProductDetailPage;