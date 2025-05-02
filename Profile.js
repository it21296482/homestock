import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const Profile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [name, setName] = useState(storedUser.name || "");
  const [email] = useState(storedUser.email || "");
  const [password, setPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      alert("❌ Name is required.");
      return;
    }

    if (password && password.length < 6) {
      alert("❌ Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5001/api/auth/update/${storedUser._id}`,
        { name, password },
        { withCredentials: true }
      );

      alert("✅ Profile updated!");
      localStorage.setItem("user", JSON.stringify(res.data.updatedUser));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Update failed.");
    }
  };

  return (
    <div className="fade-in">
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          👤 Your Profile
        </Typography>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          {/* Avatar Section */}
          <Box className="avatar-upload" display="flex" alignItems="center">
            <Avatar
              sx={{ width: 72, height: 72, mr: 2 }}
              src={avatarPreview}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <label htmlFor="upload-avatar">
              <input
                accept="image/*"
                id="upload-avatar"
                type="file"
                hidden
                onChange={handleAvatarChange}
              />
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>

          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            disabled
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Leave blank to keep your current password"
          />

          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleUpdate}
          >
            Save Changes
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default Profile;
