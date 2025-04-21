// src/app/products/page.tsx hoặc app/products/page.tsx
"use client"; // Đánh dấu đây là Client Component vì dùng useState, useEffect

import React, { useState, useEffect } from "react";
import {
  Container, // Add Container import
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
  Dialog, // Import Dialog components nếu muốn dùng Dialog thay confirm
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar, // Import Snackbar để thông báo
} from "@mui/material";
import { getProducts, deleteProduct } from "../../../utils/api"; // Import hàm gọi API
import { Product } from "../../../types/product"; // Import kiểu Product (sẽ tạo ở bước sau)
import Link from "next/link";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Hàm để fetch sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Tạm thời bỏ Guard nên không cần token ở đây
      // const token = localStorage.getItem('accessToken');
      // if (!token) {
      //   // Redirect hoặc hiển thị thông báo cần đăng nhập
      //   setError("Bạn cần đăng nhập để xem sản phẩm.");
      //   setLoading(false);
      //   return;
      // }
      const data = await getProducts();
      if (data && data.items) {
        setProducts(data.items);
        setTotalProducts(data.total || data.items.length);
      } else {
        setProducts([]);
        setTotalProducts(0);
      }
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setError(err.message || "Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm fetchProducts khi component mount lần đầu
  useEffect(() => {
    fetchProducts();
  }, []);

  // --- HÀM XỬ LÝ XÓA ---
  const handleDelete = async (id: number) => {
    // Hiển thị hộp thoại xác nhận
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm này (ID: ${id}) không?`
      )
    ) {
      try {
        // Gọi API xóa (cần gửi token nếu API đã bảo vệ)
        await deleteProduct(id);

        // Cập nhật lại state products bằng cách lọc bỏ sản phẩm đã xóa
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        setTotalProducts((prevTotal) => prevTotal - 1); // Giảm tổng số

        // Hiển thị thông báo thành công
        setSnackbar({
          open: true,
          message: "Xóa sản phẩm thành công!",
          severity: "success",
        });
      } catch (err: any) {
        console.error("Failed to delete product:", err);
        // Hiển thị thông báo lỗi
        setSnackbar({
          open: true,
          message: err.message || "Xóa sản phẩm thất bại!",
          severity: "error",
        });
      }
    }
  };

  // Hàm đóng Snackbar
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Xử lý hiển thị trạng thái loading
  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  // Xử lý hiển thị lỗi
  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        {/* Có thể thêm nút thử lại */}
        <Button variant="contained" onClick={fetchProducts} sx={{ mt: 1 }}>
          Thử lại
        </Button>
      </Container>
    );
  }

  // Hàm lấy URL đầy đủ của ảnh
  const getImageUrl = (relativePath?: string): string => {
    if (!relativePath) {
      // Trả về ảnh placeholder hoặc không hiển thị ảnh
      return "/placeholder-image.png"; // Ví dụ: đặt placeholder trong public/
    }
    // Đảm bảo không có dấu / thừa
    const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(
      /\/$/,
      ""
    );
    const imagePath = relativePath.replace(/^\//, "");
    return `${backendUrl}/${imagePath}`;
  };

  return (
    // Apply font family here. Note: Modifying the MUI theme is the recommended approach for global font changes.
    // <Container maxWidth="lg" sx={{ mt: 4, mb: 4, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Danh sách Sản phẩm ({totalProducts})
      </Typography>

      <Link href="/products/create" passHref>
        <Button variant="contained" color="primary">
          Tạo sản phẩm mới
        </Button>
      </Link>

      {/* TODO: Thêm các bộ lọc, sắp xếp, phân trang */}

      <Grid container spacing={3}>
        {products.length > 0 ? (
          products.map((product) => (
            <Grid item={true} key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    // Chiều cao cố định hoặc tỷ lệ aspect-ratio
                    // height: 140,
                    aspectRatio: "1 / 1", // Tỷ lệ 1:1
                    objectFit: "contain", // Chứa vừa ảnh, không cắt xén
                    p: 1, // Thêm padding nếu muốn
                  }}
                  image={getImageUrl(product.imageUrl)}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3, // Giới hạn 3 dòng
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Giá: ${Number(product.price).toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  {/* SỬA NÚT XEM */}
                  <Link
                    href={`/products/${product.id}`}
                    passHref
                    style={{ textDecoration: "none" }}
                  >
                    <Button size="small">Xem</Button>
                  </Link>
                  <Link href={`/products/edit/${product.id}`} passHref>
                    <Button size="small">Sửa</Button>
                  </Link>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(product.id)} // Gọi hàm handleDelete khi nhấn nút
                  >
                    Xóa
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item={true} xs={12}>
            <Typography sx={{ textAlign: "center", mt: 4 }}>
              Không có sản phẩm nào.
            </Typography>
          </Grid>
        )}
      </Grid>
      {/* Snackbar để hiển thị thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000} // Tự động ẩn sau 6 giây
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* TODO: Thêm component phân trang */}
    </Box>
  );
};

export default ProductsPage;
