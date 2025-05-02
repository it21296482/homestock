// src/pages/AdminPanel.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";
import axios from "axios";
import "../styles/global.css";

const AdminPanel = () => {
  const [members, setMembers] = useState([]);
  const [editMemberId, setEditMemberId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  // 🔄 Load members on mount
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/households/members", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      setMembers(res.data);
    } catch (err) {
      console.error("Error loading members:", err);
    }
  };

  // ➕ Invite new member
  const handleInvite = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inviteEmail || !emailRegex.test(inviteEmail)) {
      alert("❌ Please enter a valid email address.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5001/api/households/invite",
        { email: inviteEmail },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      alert("✅ Invitation sent!");
      setInviteEmail("");
      fetchMembers();
    } catch (err) {
      console.error("Invite error:", err);
      alert(err.response?.data?.msg || "❌ Failed to invite member");
    }
  };

  // 📝 Start editing a member
  const handleEdit = (member) => {
    setEditMemberId(member._id);
    setEditedName(member.name);
  };

  // 💾 Save updated name
  const handleSave = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/api/households/members/${id}`,
        { name: editedName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      alert("✅ Member updated!");
      setEditMemberId(null);
      fetchMembers();
    } catch (err) {
      alert("❌ Failed to update member");
    }
  };

  // ❌ Delete member
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/households/members/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      alert("✅ Member removed!");
      fetchMembers();
    } catch (err) {
      alert("❌ Failed to remove member");
    }
  };

  return (
    <div className="fade-in">
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          👥 Manage Household Members
        </Typography>

        {/* ➕ Invite Member */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Invite New Member
          </Typography>
          <TextField
            label="Email address"
            fullWidth
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleInvite}
            disabled={!inviteEmail.trim()}
          >
            Invite
          </Button>
        </Paper>

        {/* 👥 Member Table */}
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>
                      {editMemberId === member._id ? (
                        <TextField
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          size="small"
                        />
                      ) : (
                        member.name
                      )}
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {member.role}
                    </TableCell>
                    <TableCell align="center">
                      {editMemberId === member._id ? (
                        <IconButton onClick={() => handleSave(member._id)} color="success">
                          <Save />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => handleEdit(member)} color="primary">
                          <Edit />
                        </IconButton>
                      )}
                      <IconButton onClick={() => handleDelete(member._id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminPanel;
