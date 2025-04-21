// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Thêm state loading

  useEffect(() => {
    // Chỉ chạy ở client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      setIsAuthenticated(!!token); // !!token chuyển đổi sang boolean
      setLoading(false); // Đã kiểm tra xong
    } else {
       setLoading(false); // Không chạy ở server
    }
  }, []); // Chạy 1 lần khi mount

  // Hàm để cập nhật trạng thái (ví dụ sau khi login/logout) - tùy chọn
  const updateAuthStatus = () => {
      if (typeof window !== 'undefined') {
         const token = localStorage.getItem('accessToken');
         setIsAuthenticated(!!token);
     }
  };


  return { isAuthenticated, loading, updateAuthStatus };
}