// src/components/ImageUpload.tsx
'use client';

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Box, Button, CircularProgress, Alert, Typography, Avatar } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { uploadProductImage } from '@/utils/api'; // Import hàm upload API

// --- Styled component cho input ẩn ---
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// --- Props cho component ---
interface ImageUploadProps {
  label?: string; // Nhãn cho nút upload
  initialImageUrl?: string | null; // URL ảnh ban đầu (cho form edit)
  onUploadSuccess: (imageUrl: string) => void; // Callback khi upload thành công
  onUploadError?: (error: string) => void; // Callback khi có lỗi (tùy chọn)
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label = "Tải ảnh lên",
  initialImageUrl = null,
  onUploadSuccess,
  onUploadError,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl); // State cho ảnh preview
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref đến input file ẩn

   // Cập nhật preview nếu initialImageUrl thay đổi từ bên ngoài
   useEffect(() => {
       setPreviewUrl(initialImageUrl);
   }, [initialImageUrl]);

  // Hàm xử lý khi người dùng chọn file
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setError(null); // Xóa lỗi cũ
    const file = event.target.files?.[0];

    if (file) {
      // --- Tạo và hiển thị preview ---
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string); // Cập nhật ảnh preview
      };
      reader.readAsDataURL(file);

      // --- Thực hiện upload ---
      setUploading(true);
      try {
        const result = await uploadProductImage(file); // Gọi API upload
        if (result?.imageUrl) {
          onUploadSuccess(result.imageUrl); // Gọi callback báo thành công với URL mới
          // Preview đã được cập nhật ở trên
        } else {
           throw new Error("Không nhận được URL ảnh từ API.");
        }
      } catch (err: any) {
        console.error("Upload failed:", err);
        const errorMessage = err.message || "Upload ảnh thất bại.";
        setError(errorMessage);
        setPreviewUrl(initialImageUrl); // Quay lại ảnh ban đầu nếu lỗi
        if (onUploadError) {
          onUploadError(errorMessage);
        }
      } finally {
        setUploading(false);
        // Reset input file để có thể chọn lại cùng file nếu muốn
        if (fileInputRef.current) {
             fileInputRef.current.value = '';
        }
      }
    }
  };

  // Hàm lấy URL đầy đủ của ảnh (sửa đổi để xử lý data: URI)
  const getFullImageUrl = (relativePath?: string | null): string | null => {
      if (!relativePath) {
          return null;
      }

      // *** Nếu là data URI, trả về trực tiếp ***
      if (relativePath.startsWith('data:image')) {
          return relativePath;
      }

      // Nếu không phải data URI, xây dựng URL đầy đủ từ backend
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');
      // Đảm bảo đường dẫn bắt đầu bằng 'uploads/' nếu cần
      let imagePath = relativePath.replace(/^\//, '');
      if (!imagePath.startsWith('uploads/')) {
          imagePath = `uploads/${imagePath}`;
      }
      return `${backendUrl}/${imagePath}`;
  }

  // *** Sử dụng previewUrl trực tiếp nếu là data URI, hoặc gọi getFullImageUrl nếu là path ***
  const finalPreviewUrl = previewUrl?.startsWith('data:image') 
                            ? previewUrl 
                            : getFullImageUrl(previewUrl);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: '1px dashed grey', p: 2, borderRadius: 1 }}>
      <Typography variant="subtitle1" gutterBottom>{label}</Typography>

      {/* Hiển thị ảnh preview hoặc placeholder */}
      <Avatar
        src={finalPreviewUrl ?? undefined} // Dùng undefined nếu null để hiển thị icon mặc định
        alt="Ảnh sản phẩm"
        variant="rounded"
        sx={{ width: 150, height: 150, mb: 1, bgcolor: 'grey.200' }} // Thêm bgcolor
      >
         {/* Có thể thêm Icon mặc định nếu không có ảnh */}
         {!finalPreviewUrl && <CloudUploadIcon />}
      </Avatar>


      {/* Nút Upload */}
      <Button
        component="label" // Quan trọng: component="label" liên kết với input ẩn
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
        disabled={uploading}
      >
        {uploading ? 'Đang tải lên...' : (previewUrl ? 'Chọn ảnh khác' : 'Chọn ảnh')}
        <VisuallyHiddenInput
          type="file"
          accept="image/png, image/jpeg, image/gif" // Chỉ chấp nhận ảnh
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </Button>

      {/* Hiển thị lỗi */}
      {error && <Alert severity="error" sx={{ width: '100%', mt: 1 }}>{error}</Alert>}
    </Box>
  );
};

export default ImageUpload;