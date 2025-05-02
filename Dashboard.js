import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const name = user?.name || "User";
  const email = user?.email || "your@email.com";
  const [householdName, setHouseholdName] = useState("Your Household");

  // ✅ Fetch household from backend
  useEffect(() => {
    const fetchHousehold = async () => {
      if (user?._id) {
        try {
          const res = await axios.get(
            `http://localhost:5001/api/households/by-user/${user._id}`
          );
          setHouseholdName(res.data.name);
        } catch (err) {
          console.error("❌ Failed to fetch household", err);
        }
      }
    };

    fetchHousehold();
  }, [user?._id]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="fade-in">
      <Container sx={{ py: 6 }}>
        {/* 🎯 Hero Section */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome back, {name} 👋
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your household, inventory, and shopping list all in one place.
        </Typography>

        {/* 👤 Profile Card */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 5 }}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ width: 64, height: 64, mr: 3 }}>
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">{name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {email}
              </Typography>
              <Typography variant="body2" color="success.main">
                🏠 {householdName}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* 💫 Action Buttons */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={() => navigate("/inventory")}
            >
              📦 Inventory
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              color="success"
              onClick={() => navigate("/shopping-list")}
            >
              📝 Shopping List
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              color="secondary"
              onClick={() => navigate("/profile")}
            >
              👤 Update Profile
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              color="error"
              onClick={handleLogout}
            >
              🔓 Logout
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
