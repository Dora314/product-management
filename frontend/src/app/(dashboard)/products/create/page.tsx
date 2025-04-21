// src/app/(dashboard)/products/create/page.tsx
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  InputAdornment,
} from "@mui/material";
import { createProduct } from "@/utils/api"; // Import hàm API tạo sản phẩm
import ImageUpload from "@/components/ImageUpload"; // Đường dẫn tới component

// Interface cho dữ liệu form (có thể dùng Partial<Product> nếu muốn)
interface ProductFormData {
  name: string;
  description: string;
  price: number | string; // Cho phép string để input dễ hơn, sẽ convert khi gửi
  imageUrl?: string;
}

const CreateProductPage = () => {
  const router = useRouter(); // Hook để điều hướng

  const [formData, setFormData] = useState<ProductFormData>({
    // State cho dữ liệu form
    name: "",
    description: "",
    price: "", // Khởi tạo là chuỗi rỗng cho input
    imageUrl: "",
  });
  const [submitting, setSubmitting] = useState(false); // State loading khi submit
  const [error, setError] = useState<string | null>(null); // State lỗi
  const [success, setSuccess] = useState<string | null>(null); // State thông báo thành công

  // Hàm xử lý thay đổi input trong form
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Cập nhật giá trị tương ứng
    }));
  };

  // Hàm callback để cập nhật imageUrl trong formData
  const handleUploadSuccess = (uploadedUrl: string) => {
    setFormData((prevData) => ({
      ...prevData,
      imageUrl: uploadedUrl, // Cập nhật state với URL mới
    }));
  };

  // Hàm xử lý submit form
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Validate price trước khi gửi
    const priceNumber = parseFloat(String(formData.price)); // Chuyển price sang số
    if (isNaN(priceNumber) || priceNumber < 0) {
      setError("Giá sản phẩm không hợp lệ.");
      setSubmitting(false);
      return;
    }

    try {
      // Chuẩn bị dữ liệu gửi đi, đảm bảo price là number
      const productDataToSend = {
        ...formData,
        price: priceNumber,
      };

      await createProduct(productDataToSend); // Gọi API tạo sản phẩm
      setSuccess("Sản phẩm đã được tạo thành công!");

      // Reset form sau khi thành công
      setFormData({ name: "", description: "", price: "", imageUrl: "" });

      // Tùy chọn: Điều hướng về trang danh sách sau khi thành công
      setTimeout(() => {
        router.push("/products");
      }, 1500); // Chờ 1.5 giây rồi chuyển hướng
    } catch (err: any) {
      console.error("Failed to create product:", err);
      setError(err.message || "Tạo sản phẩm thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Hiển thị UI ----
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tạo Sản phẩm Mới
      </Typography>

      {/* Hiển thị lỗi submit */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {/* Hiển thị thông báo thành công */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Tên sản phẩm"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoFocus // Tự động focus vào trường này
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Mô tả"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="price"
              label="Giá"
              name="price"
              type="number" // Vẫn dùng type number để có UI phù hợp
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
                inputProps: { min: 0, step: "0.01" },
              }}
              value={formData.price} // Liên kết với state (có thể là chuỗi)
              onChange={handleChange}
              error={
                isNaN(parseFloat(String(formData.price))) &&
                formData.price !== ""
              } // Hiện lỗi nếu không phải số
              helperText={
                isNaN(parseFloat(String(formData.price))) &&
                formData.price !== ""
                  ? "Vui lòng nhập số"
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12}>
            <ImageUpload
              label="Ảnh sản phẩm"
              initialImageUrl={formData.imageUrl} // Truyền imageUrl từ state product
              onUploadSuccess={handleUploadSuccess}
              // onUploadError={(errMsg) => setError(errMsg)}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={
            submitting ||
            !formData.name ||
            !formData.description ||
            isNaN(parseFloat(String(formData.price)))
          } // Disable nếu đang submit hoặc thiếu trường required hoặc giá không hợp lệ
        >
          {submitting ? <CircularProgress size={24} /> : "Tạo Sản phẩm"}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => router.push("/products")} // Nút quay lại danh sách
          sx={{ mb: 2 }}
        >
          Quay lại danh sách
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateProductPage;
