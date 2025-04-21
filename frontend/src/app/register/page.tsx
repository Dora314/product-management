// src/app/register/page.tsx
"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { register as apiRegister, login as apiLogin } from "@/utils/api";
import { useAuthContext } from "@/contexts/AuthContext";

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

export default function RegisterPage() {
  const router = useRouter();
  const { login: contextLogin } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!username || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      setLoading(false);
      return;
    }

    try {
      const registeredUser = await apiRegister({ username, password });

      if (registeredUser?.id) {
        console.log('Registration successful:', registeredUser);

        try {
          const loginData = await apiLogin({ username, password });
          if (loginData?.accessToken) {
            console.log('Auto-login successful');
            contextLogin(loginData.accessToken);
            setSuccess("Đăng ký và đăng nhập thành công! Đang chuyển hướng...");
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push("/products"); // Change redirect path to /products
            }, 1500);
          } else {
            setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
            setError("Không thể tự động đăng nhập.");
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          }
        } catch (loginErr: any) {
          console.error("Auto-login failed:", loginErr);
          setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
          setError(loginErr.message || "Lỗi khi tự động đăng nhập.");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }

      } else {
        setError("Đăng ký thất bại. Phản hồi không hợp lệ từ máy chủ.");
        setLoading(false);
      }
    } catch (regErr: any) {
      console.error("Registration failed:", regErr);
      setError(
        regErr.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
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
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng ký tài khoản
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
            {success}
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading || !!success}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu (ít nhất 6 ký tự)"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || !!success}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading || !!success}
            error={password !== confirmPassword && confirmPassword !== ''}
            helperText={password !== confirmPassword && confirmPassword !== '' ? "Mật khẩu không khớp" : ""}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !!success}
          >
            {loading ? <CircularProgress size={24} /> : "Đăng ký"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                {"Đã có tài khoản? Đăng nhập"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}