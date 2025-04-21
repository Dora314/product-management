// src/contexts/AuthContext.tsx
'use client'; // Đánh dấu là Client Component vì sử dụng state, effect, và localStorage

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation'; // Import nếu bạn muốn redirect từ đây (thường thì nên để component gọi tự redirect)

// Định nghĩa kiểu dữ liệu cho giá trị của Context
interface AuthContextType {
  isAuthenticated: boolean; // Trạng thái đăng nhập
  isLoading: boolean; // Trạng thái đang kiểm tra xác thực ban đầu
  login: (token: string) => void; // Hàm để cập nhật state khi login thành công
  logout: () => void; // Hàm để cập nhật state khi logout
  checkAuthStatus: () => void; // Hàm để kiểm tra lại trạng thái (có thể cần thiết)
}

// Tạo Context với giá trị mặc định là undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Bắt đầu với trạng thái loading

  // Hàm kiểm tra token trong localStorage
  // useCallback để tránh tạo lại hàm không cần thiết
  const checkAuthStatus = useCallback(() => {
    // Chỉ chạy ở client-side
    if (typeof window !== 'undefined') {
      setIsLoading(true); // Bắt đầu kiểm tra
      try {
        const token = localStorage.getItem('accessToken');
        const authenticated = !!token; // Chuyển đổi sự tồn tại của token thành boolean
        setIsAuthenticated(authenticated);
        console.log(
          'AuthProvider: Checked token status, isAuthenticated:',
          authenticated
        );
      } catch (error) {
        console.error('AuthProvider: Error reading localStorage', error);
        setIsAuthenticated(false); // Giả sử không xác thực nếu có lỗi đọc localStorage
      } finally {
        setIsLoading(false); // Kết thúc kiểm tra
      }
    } else {
      // Nếu ở server-side, mặc định là không xác thực và không loading
      setIsLoading(false);
      setIsAuthenticated(false);
    }
  }, []); // Không có dependencies, chỉ tạo 1 lần

  // Chạy kiểm tra trạng thái lần đầu khi Provider được mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Hàm được gọi khi đăng nhập thành công
  const login = (token: string) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('accessToken', token); // Lưu token
        setIsAuthenticated(true); // Cập nhật state
        console.log('AuthProvider: login() called, state updated to true.');
      } catch (error) {
        console.error('AuthProvider: Error writing to localStorage', error);
        // Có thể xử lý lỗi lưu trữ ở đây nếu cần
      }
    }
  };

  // Hàm được gọi khi đăng xuất
  const logout = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('accessToken'); // Xóa token
        setIsAuthenticated(false); // Cập nhật state
        console.log('AuthProvider: logout() called, state updated to false.');
      } catch (error) {
        console.error('AuthProvider: Error removing from localStorage', error);
      }
    }
  };

  // Cung cấp giá trị context cho các component con
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, logout, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Tạo Hook tùy chỉnh để dễ dàng sử dụng Context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  // Đảm bảo hook được sử dụng bên trong AuthProvider
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};