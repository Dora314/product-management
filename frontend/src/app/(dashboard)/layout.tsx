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

  // 1. If loading OR (not loading AND not authenticated), show spinner
  //    (Spinner is shown while loading or while waiting for redirect)
  if (isLoading || (!isLoading && !isAuthenticated)) {
    // Use a different console log message here for clarity
    console.log("Layout Rendering - Loading authentication state or redirecting...");
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. If not loading AND authenticated, render DashboardLayout
  // This condition is only met if !isLoading && isAuthenticated
  console.log("Layout Rendering - Authenticated, rendering dashboard");
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}