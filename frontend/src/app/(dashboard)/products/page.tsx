// src/app/(dashboard)/products/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Dialog, // Đã import
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar, // Đã import
  Skeleton, // *** Thêm Skeleton ***
} from "@mui/material";
import { getProducts, deleteProduct } from "@/utils/api"; // Điều chỉnh đường dẫn nếu cần
import { Product } from "@/types/product"; // Điều chỉnh đường dẫn nếu cần
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext"; // Import nếu cần kiểm tra auth

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Loading cho lần fetch đầu
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // --- State cho Dialog xác nhận xóa ---
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<number | null>(
    null
  );
  // --- State cho loading khi xóa ---
  const [deletingId, setDeletingId] = useState<number | null>(null);
  // Optional: Lấy trạng thái auth nếu cần kiểm tra trước khi fetch/delete
  // const { isAuthenticated } = useAuthContext();

  // Hàm để fetch sản phẩm (dùng useCallback để ổn định tham chiếu)
  const fetchProducts = useCallback(async () => {
    // Optional: Kiểm tra isAuthenticated trước khi fetch
    // if (!isAuthenticated) {
    //   setError("Bạn cần đăng nhập.");
    //   setLoading(false);
    //   return;
    // }
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(); // API đã tự gửi token nếu có
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
  }, []); // Thêm dependency nếu có (ví dụ: isAuthenticated)

  // Gọi hàm fetchProducts khi component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Sử dụng fetchProducts từ useCallback

  // --- Mở Dialog xác nhận ---
  const handleOpenConfirmDialog = (id: number) => {
    setProductToDeleteId(id);
    setConfirmDialogOpen(true);
  };

  // --- Đóng Dialog xác nhận ---
  const handleCloseConfirmDialog = () => {
    setProductToDeleteId(null);
    setConfirmDialogOpen(false);
  };

  // --- Xác nhận Xóa (trong Dialog) ---
  const handleConfirmDelete = async () => {
    if (productToDeleteId === null) return;

    setDeletingId(productToDeleteId); // *** Bắt đầu loading cho item này ***
    handleCloseConfirmDialog(); // Đóng dialog ngay

    try {
      await deleteProduct(productToDeleteId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productToDeleteId)
      );
      setTotalProducts((prevTotal) => prevTotal - 1);
      setSnackbar({
        open: true,
        message: "Xóa sản phẩm thành công!",
        severity: "success",
      });
    } catch (err: any) {
      console.error("Failed to delete product:", err);
      setSnackbar({
        open: true,
        message: err.message || "Xóa sản phẩm thất bại!",
        severity: "error",
      });
    } finally {
      setDeletingId(null); // *** Kết thúc loading cho item này ***
    }
  };

  // Hàm đóng Snackbar
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  // Hàm lấy URL ảnh (sửa đổi để thêm /uploads/)
  const getImageUrl = (relativePath?: string): string => {
    if (!relativePath) {
      // Use placehold.co instead of via.placeholder.com for default placeholder
      return "https://placehold.co/300";
    }
    const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000').replace(
      /\/$/, // Loại bỏ dấu / ở cuối backendUrl nếu có
      ""
    );
    // Loại bỏ dấu / ở đầu relativePath nếu có
    let imagePath = relativePath.replace(/^\//, "");

    // *** Đảm bảo đường dẫn bắt đầu bằng 'uploads/' ***
    if (!imagePath.startsWith("uploads/")) {
      imagePath = `uploads/${imagePath}`;
    }

    return `${backendUrl}/${imagePath}`;
  };

  // --- Xử lý hiển thị Lỗi (giữ nguyên) ---
  if (!loading && error) {
    // Chỉ hiện lỗi khi không còn loading
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchProducts} sx={{ mt: 1 }}>
          Thử lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Danh sách Sản phẩm {!loading && `(${totalProducts})`}{" "}
          {/* Chỉ hiện total khi không loading */}
        </Typography>
        <Link href="/products/create" passHref>
          <Button variant="contained" color="primary" disabled={loading}>
            {" "}
            {/* Disable nút khi đang tải lần đầu */}
            Tạo sản phẩm mới
          </Button>
        </Link>
      </Box>

      {/* TODO: Thêm các bộ lọc, sắp xếp, phân trang */}

      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
        {/* *** Hiển thị Skeleton khi Loading *** */}
        {loading
          ? Array.from(new Array(8)).map((_, index) => (
              // Giả sử hiển thị 8 skeletons
              <Grid key={index} size={{ xs: 4, sm: 4, md: 4, lg: 3 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    sx={{ aspectRatio: "1 / 1", height: "auto" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" sx={{ fontSize: "1.25rem" }} />{" "}
                    {/* h6 */}
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem", mt: 1 }}
                      width="40%"
                    />{" "}
                    {/* Price */}
                  </CardContent>
                  <CardActions>
                    <Skeleton variant="rounded" width={50} height={30} />
                    <Skeleton variant="rounded" width={50} height={30} />
                    <Skeleton variant="rounded" width={50} height={30} />
                  </CardActions>
                </Card>
              </Grid>
            ))
          : // --- Hiển thị danh sách sản phẩm thực tế ---
          products.length > 0 ? (
            products.map((product) => (
              <Grid key={product.id} size={{ xs: 4, sm: 4, md: 4, lg: 3 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 300, height: 300, objectFit: "cover" }}
                    image={getImageUrl(product.imageUrl)}
                    alt={product.name}
                    onError={(e) => {
                      // Xử lý lỗi tải ảnh
                      (e.target as HTMLImageElement).onerror = null; // Ngăn lặp vô hạn
                      // Use placehold.co instead of via.placeholder.com
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/300"; // Ảnh mặc định
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ /* ... giới hạn dòng ... */ }}
                    >
                      {product.description}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      Giá: ${Number(product.price).toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link
                      href={`/products/${product.id}`}
                      passHref
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        size="small"
                        disabled={deletingId === product.id}
                      >
                        {" "}
                        {/* Disable khi đang xóa */}
                        Xem
                      </Button>
                    </Link>
                    <Link href={`/products/edit/${product.id}`} passHref>
                      <Button
                        size="small"
                        disabled={deletingId === product.id}
                      >
                        {" "}
                        {/* Disable khi đang xóa */}
                        Sửa
                      </Button>
                    </Link>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleOpenConfirmDialog(product.id)} // *** Mở Dialog ***
                      disabled={deletingId === product.id} // *** Disable khi đang xóa ***
                    >
                      {/* *** Hiển thị loading khi đang xóa item này *** */}
                      {deletingId === product.id ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Xóa"
                      )}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            // --- Hiển thị khi không có sản phẩm ---
            <Grid size={{ xs: 4 }}>
              <Typography sx={{ textAlign: "center", mt: 4 }}>
                Không có sản phẩm nào.
              </Typography>
            </Grid>
          )}
      </Grid>

      {/* --- Dialog Xác nhận Xóa --- */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa sản phẩm?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không
            thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Xác nhận Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Snackbar Thông báo --- */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000} // Giảm thời gian hiển thị một chút
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled" // Làm nổi bật hơn
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* TODO: Thêm component phân trang */}
    </Container>
  );
};

export default ProductsPage;