// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import "../styles/global.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [household, setHousehold] = useState(null);

  // ✅ Fetch household using user ID
  useEffect(() => {
    if (!user?._id) return;

    const fetchHousehold = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/households/by-user/${user._id}`
        );
        setHousehold(res.data);
      } catch (err) {
        console.error("❌ No household found");
        setHousehold(null);
      }
    };

    fetchHousehold();
  }, [user?._id]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Household Member Report", 14, 15);
    doc.autoTable({
      startY: 25,
      head: [["Name", "Email", "Role"]],
      body: household?.members.map((member) => [
        member.name,
        member.email,
        member.role.toUpperCase(),
      ]),
    });
    doc.save("household_members.pdf");
  };

  return (
    <div className="fade-in">
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          🛠️ Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your household and members with full access.
        </Typography>

        {!household ? (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              🚫 No Household Found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              You are not currently in a household. Please create one to continue.
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/create-household")}
            >
              ➕ Create Household
            </Button>
          </Paper>
        ) : (
          <>
            {/* ✅ Household Summary */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Household Summary
              </Typography>
              <Typography>
                🏠 Household: <strong>{household.name}</strong>
              </Typography>
              <Typography>
                👥 Members: <strong>{household.members.length}</strong>
              </Typography>
              <Typography>
                👑 Admin: <strong>{user.name}</strong> ({user.email})
              </Typography>
            </Paper>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/admin")}
                >
                  👥 Manage Members
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="success"
                  onClick={exportPDF}
                >
                  🧾 Download PDF Report
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </div>
  );
};

export default AdminDashboard;
