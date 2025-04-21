// src/app/(dashboard)/products/edit/[id]/page.tsx
'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Hooks từ next/navigation
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    CircularProgress,
    Alert,
    Paper,
    Grid,
    InputAdornment
} from '@mui/material';
import { getProductById, updateProduct } from '@/utils/api'; // Import API functions
import { Product } from '@/types/product'; // Import Product type

const EditProductPage = () => {
    const params = useParams(); // Lấy params từ URL
    const router = useRouter(); // Hook để điều hướng
    const id = params?.id as string; // Lấy id sản phẩm, ép kiểu về string

    const [product, setProduct] = useState<Partial<Product>>({ // State cho dữ liệu form, dùng Partial để khởi tạo rỗng
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
    });
    const [loading, setLoading] = useState(true); // State loading khi fetch dữ liệu ban đầu
    const [submitting, setSubmitting] = useState(false); // State loading khi submit form
    const [error, setError] = useState<string | null>(null); // State lỗi fetch/submit
    const [success, setSuccess] = useState<string | null>(null); // State thông báo thành công

    // Fetch dữ liệu sản phẩm khi component mount hoặc id thay đổi
    useEffect(() => {
        if (id) {
            setLoading(true);
            setError(null);
            getProductById(id)
                .then((data) => {
                    if (data) {
                        // Cập nhật state form với dữ liệu lấy được
                        setProduct({
                            name: data.name || '',
                            description: data.description || '',
                            // Chuyển giá về kiểu number để hiển thị đúng trong TextField type="number"
                            price: data.price !== undefined ? Number(data.price) : 0,
                            imageUrl: data.imageUrl || '',
                        });
                    } else {
                         setError('Không tìm thấy sản phẩm.');
                    }
                })
                .catch((err) => {
                    console.error('Failed to fetch product:', err);
                    setError(err.message || 'Không thể tải thông tin sản phẩm.');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setError('ID sản phẩm không hợp lệ.');
            setLoading(false);
        }
    }, [id]); // Dependency array là [id]

    // Hàm xử lý thay đổi input trong form
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = event.target;

        setProduct((prevProduct) => ({
            ...prevProduct,
            // Nếu là kiểu number, chuyển đổi giá trị sang số
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    // Hàm xử lý submit form
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Ngăn chặn hành vi submit mặc định của form
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            // **QUAN TRỌNG:** Đảm bảo `product.price` là kiểu number trước khi gửi đi
            // API backend có thể mong đợi price là number hoặc string tùy cách bạn định nghĩa DTO và entity
            // Nếu backend mong đợi number, hãy giữ nguyên. Nếu mong đợi string, chuyển đổi lại.
            // Ở đây giả định backend nhận number cho price.
            const updateData = {
                 ...product,
                 price: Number(product.price) // Đảm bảo price là number
            }

            await updateProduct(id, updateData); // Gọi API update
            setSuccess('Cập nhật sản phẩm thành công!');
            // Tùy chọn: Điều hướng về trang danh sách sau khi thành công
            // setTimeout(() => {
            //    router.push('/products');
            // }, 1500); // Chờ 1.5 giây rồi chuyển hướng

        } catch (err: any) {
            console.error('Failed to update product:', err);
            setError(err.message || 'Cập nhật sản phẩm thất bại.');
        } finally {
            setSubmitting(false);
        }
    };

    // ---- Hiển thị UI ----

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Không tìm thấy sản phẩm hoặc lỗi ban đầu
    if (error && !product.name) { // Chỉ hiển thị lỗi này nếu chưa có dữ liệu sản phẩm
         return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
    }


    return (
        // Container đã được cung cấp bởi DashboardLayout, không cần thêm ở đây
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Chỉnh sửa Sản phẩm (ID: {id})
            </Typography>

            {/* Hiển thị lỗi submit */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {/* Hiển thị thông báo thành công */}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Tên sản phẩm"
                            name="name"
                            value={product.name || ''}
                            onChange={handleChange}
                            autoFocus
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="description"
                            label="Mô tả"
                            name="description"
                            multiline
                            rows={4}
                            value={product.description || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid  size={{ xs: 12, sm: 6 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="price"
                            label="Giá"
                            name="price"
                            type="number" // Sử dụng type number
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                // Đảm bảo step phù hợp với số thập phân
                                inputProps: { min: 0, step: "0.01" }
                            }}
                            value={product.price ?? 0} // Dùng ?? 0 để tránh lỗi khi giá trị là undefined/null
                            onChange={handleChange}
                        />
                    </Grid>
                     <Grid  size={{ xs: 12, sm: 6 }}>
                         <TextField
                             margin="normal"
                             fullWidth
                             id="imageUrl"
                             label="URL Hình ảnh"
                             name="imageUrl"
                             value={product.imageUrl || ''}
                             onChange={handleChange}
                             // TODO: Tích hợp component Upload ảnh ở đây thay vì chỉ là TextField
                         />
                     </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={submitting} // Disable nút khi đang submit
                >
                    {submitting ? <CircularProgress size={24} /> : 'Lưu thay đổi'}
                </Button>
                 <Button
                     fullWidth
                     variant="outlined"
                     onClick={() => router.push('/products')} // Nút quay lại danh sách
                     sx={{ mb: 2 }}
                 >
                     Quay lại danh sách
                 </Button>
            </Box>
        </Paper>
    );
};

export default EditProductPage;