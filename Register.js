// src/pages/Register.js
import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const roles = ["Administrator", "Family Member"];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(roles[0]);
  const navigate = useNavigate();

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !password || !role) {
      alert("❌ All fields are required.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("❌ Please enter a valid email address.");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("✅ Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err);
      alert(err.response?.data?.msg || "❌ Registration failed.");
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
            Create Account 
          </Typography>
          <Typography align="center" color="textSecondary" sx={{ mb: 3 }}>
            Join HomeStock and manage your household with ease
          </Typography>

          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            select
            label="Select your role"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>

          <Button
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            onClick={handleRegister}
          >
            Register
          </Button>

          <Typography align="center" sx={{ mt: 3 }}>
            Already have an account?{" "}
            <Link
              href="/"
              underline="hover"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Login here
            </Link>
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default Register;
