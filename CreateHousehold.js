import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateHousehold = () => {
  const [householdName, setHouseholdName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!householdName.trim()) {
      setError("Please enter a household name!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5001/api/households/create",
        { name: householdName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      setSuccess(true);
      setError("");
      setHouseholdName("");

      // Optional: Redirect to Admin Dashboard after 2s
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 2000);
    } catch (err) {
      setSuccess(false);
      setError(err.response?.data?.msg || "❌ Failed to create household");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          🏠 Create Household
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter a household name to get started
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ Household created! Redirecting to Dashboard...
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Household Name"
          value={householdName}
          onChange={(e) => setHouseholdName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleCreate}
        >
          Create
        </Button>
      </Paper>
    </Container>
  );
};

export default CreateHousehold;
