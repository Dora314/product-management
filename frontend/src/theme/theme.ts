// src/theme/theme.ts hoặc theme/theme.ts
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Tạo instance theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6', // Màu chính
    },
    secondary: {
      main: '#19857b', // Màu phụ
    },
    error: {
      main: red.A400, // Màu lỗi
    },
    // Bạn có thể tùy chỉnh thêm các màu khác, ví dụ: background, text
  },
  typography: {
    // Tùy chỉnh font chữ, kích thước, v.v. nếu muốn
    // fontFamily: [
    //   '-apple-system',
    //   'BlinkMacSystemFont',
    //   '"Segoe UI"',
    //   'Roboto',
    // ].join(','),
  },
  // Bạn có thể tùy chỉnh thêm các thuộc tính khác của theme
});

export default theme;