// src/pages/Login.js
import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // ✅ Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("❌ Please enter a valid email address.");
      return;
    }

    // ✅ Password empty check
    if (!password) {
      alert("❌ Please enter your password.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { token, user } = res.data;

      console.log("Login response:", res.data);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const role = user.role?.toUpperCase(); // Normalize role

      if (role === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="fade-in">
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Log In
          </Typography>

          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Typography align="right" sx={{ mt: 1, mb: 2 }}>
            <Link href="#" underline="hover" sx={{ fontSize: 14 }}>
              Forgot Password?
            </Link>
          </Typography>

          <Button
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 1 }}
            onClick={handleLogin}
          >
            Continue
          </Button>

          <Typography align="center" sx={{ mt: 3 }}>
            Don’t have an account?{" "}
            <Link
              href="/register"
              underline="hover"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Register here
            </Link>
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
