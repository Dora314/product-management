// src/app/login/page.tsx
"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link"; // Hoặc next/link
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { login, logout } from "@/utils/api"; // Import hàm login, logout từ api utils

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Product Management App
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const username = data.get("username") as string;
    const password = data.get("password") as string;

    if (!username || !password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu.");
      setLoading(false);
      return;
    }

    try {
      // Gọi API login và lưu token (hàm login đã xử lý lưu vào localStorage)
      const loginData = await login({ username, password });

      if (loginData?.accessToken) {
        console.log('Login Data Received:', loginData);
        // Redirect immediately after successful login
        router.push("/products"); // Hoặc '/' nếu trang chủ là dashboard
      } else {
        // Trường hợp API trả về thành công nhưng không có token (ít xảy ra)
        setError("Đăng nhập thất bại. Không nhận được token.");
        // Ensure logout is called if login technically succeeded but returned no token
        logout();
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      // Call the imported logout function to clear any potentially stored invalid token
      logout();
      setError(
        err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Tên đăng nhập"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {/* Có thể thêm Checkbox "Remember me" nếu cần */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Đăng nhập"}
          </Button>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Quên mật khẩu?
              </Link>
            </Grid> */}
            <Grid item>
              <Link href="/register" variant="body2">
                {" "}
                {/* TODO: Tạo trang Register */}
                {"Chưa có tài khoản? Đăng ký"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
