// src/components/Layout/DashboardLayout.tsx
"use client"; // !! Quan trọng

import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container"; // Giữ lại Container ở đây để bao bọc nội dung trang
import Link from "@mui/material/Link"; // Hoặc dùng Link từ 'next/link'
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "./listItems"; // Sẽ tạo file này
import LogoutIcon from "@mui/icons-material/Logout"; // Import icon Logout
import { logout } from "@/utils/api"; // Import hàm logout
import { useRouter } from "next/navigation"; // Import useRouter từ next/navigation

// --- Phần code styled components (Drawer, AppBar) giữ nguyên từ template ---
const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO: Nên định nghĩa theme ở một nơi tập trung (như đã làm với ThemeRegistry)
// const defaultTheme = createTheme(); // Không cần tạo theme ở đây nữa nếu đã có ThemeRegistry

// Đổi tên component thành DashboardLayout và nhận children
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(true);
  const router = useRouter(); // Khởi tạo router

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handleLogout = () => {
    logout(); // Xóa token
    router.push("/login"); // Điều hướng về trang login
  };
  return (
    // Không cần ThemeProvider ở đây nếu đã có ở root layout
    // <ThemeProvider theme={defaultTheme}>
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Product Management {/* Thay đổi tiêu đề nếu muốn */}
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {/* TODO: Thêm nút Logout hoặc User Menu */}
          <IconButton color="inherit" onClick={handleLogout}>
            {" "}
            {/* Nút Logout */}
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {mainListItems} {/* Menu chính */}
          <Divider sx={{ my: 1 }} />
          {secondaryListItems} {/* Menu phụ (nếu có) */}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar /> {/* Spacer để đẩy nội dung xuống dưới AppBar */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* **RENDER NỘI DUNG TRANG Ở ĐÂY** */}
          {children}
          {/* Phần Copyright giữ nguyên hoặc bỏ đi */}
          {/* <Copyright sx={{ pt: 4 }} /> */}
        </Container>
      </Box>
    </Box>
    // </ThemeProvider>
  );
}
