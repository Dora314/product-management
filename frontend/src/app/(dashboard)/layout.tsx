// src/app/(dashboard)/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Lấy cả isAuthenticated và isLoading từ context
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    console.log('Layout Effect Triggered - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

    // Chỉ thực hiện redirect nếu việc kiểm tra đã hoàn tất (isLoading = false)
    // VÀ người dùng không được xác thực
    if (!isLoading && !isAuthenticated) {
      console.log('Redirecting to /login');
      router.replace('/login'); // Sử dụng replace để không lưu trang dashboard vào history
    }
    // Không cần làm gì nếu đang loading hoặc đã xác thực
  }, [isAuthenticated, isLoading, router]); // Dependencies chính xác

  // --- Logic Render ---

  // 1. Nếu đang loading, hiển thị spinner
  if (isLoading) {
    console.log("Layout Rendering - Loading state");
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. Nếu không loading VÀ ĐÃ xác thực, render DashboardLayout và children
  if (!isLoading && isAuthenticated) {
     console.log("Layout Rendering - Authenticated, rendering dashboard");
    return (
      <DashboardLayout>
        {children}
      </DashboardLayout>
    );
  }

  // 3. Nếu không loading VÀ KHÔNG xác thực, không render gì cả (useEffect sẽ xử lý redirect)
  // Việc trả về null ở đây ngăn việc render thoáng qua nội dung dashboard trước khi redirect.
  console.log("Layout Rendering - Not authenticated, waiting for redirect effect");
  return null;
}