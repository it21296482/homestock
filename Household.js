import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/global.css";

const Household = () => {
  const [household, setHousehold] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHouseholdMembers();
  }, []);

  const fetchHouseholdMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const res = await axios.get("http://localhost:5001/api/household/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHousehold(res.data || { members: [] });
    } catch (err) {
      console.error("Error fetching members:", err);
      setHousehold({ members: [] });
    } finally {
      setLoading(false);
    }
  };

  const createHousehold = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5001/api/household/create",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHousehold(res.data.household);
    } catch (err) {
      alert("❌ Error creating household");
    }
  };

  const inviteMember = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5001/api/household/invite",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchHouseholdMembers();
      setEmail("");
    } catch (err) {
      alert("❌ Error inviting member");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/household/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHouseholdMembers();
    } catch (err) {
      console.error("❌ Failed to delete member:", err.response?.data || err);
      alert("❌ Failed to delete member. Check console for details.");
    }
  };

  const openEditDialog = (member) => {
    setSelectedMember({ ...member });
    setEditDialogOpen(true);
  };

  const handleEditChange = (field, value) => {
    setSelectedMember((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5001/api/household/members/${selectedMember._id}`,
        { name: selectedMember.name, email: selectedMember.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditDialogOpen(false);
      fetchHouseholdMembers();
    } catch (err) {
      console.error("❌ Failed to update member:", err.response?.data || err);
      alert("❌ Failed to update member. Check console for details.");
    }
  };

  const generatePDF = () => {
    if (!household?.members?.length) {
      alert("❌ No members to export.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Household Members Report", 14, 15);

    const tableColumn = ["Name", "Email"];
    const tableRows = household.members.map((m) => [m.name, m.email]);

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 25 });
    doc.save("Household_Members.pdf");
  };

  return (
    <div className="fade-in">
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            🏡 Manage Household
          </Typography>

          {!household ? (
            <Box>
              <TextField
                label="Household Name"
                fullWidth
                margin="normal"
                onChange={(e) => setName(e.target.value)}
              />
              <Button variant="contained" color="primary" fullWidth onClick={createHousehold}>
                ➕ Create Household
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mt: 2 }}>👨‍👧 Members</Typography>
              <List>
                {loading ? (
                  <ListItem><ListItemText primary="Loading..." /></ListItem>
                ) : (
                  household.members.map((member) => (
                    <ListItem
                      key={member._id}
                      divider
                      secondaryAction={
                        <>
                          <Tooltip title="Edit">
                            <IconButton edge="end" onClick={() => openEditDialog(member)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton edge="end" onClick={() => handleDelete(member._id)}>
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        </>
                      }
                    >
                      <ListItemText primary={member.name} secondary={member.email} />
                    </ListItem>
                  ))
                )}
              </List>

              <Button
                variant="contained"
                color="success"
                fullWidth
                startIcon={<PictureAsPdfIcon />}
                onClick={generatePDF}
                sx={{ mt: 2 }}
              >
                📄 Export Household Members
              </Button>

              <TextField
                label="Invite Member Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button variant="contained" color="secondary" fullWidth onClick={inviteMember}>
                ✉️ Invite Member
              </Button>
            </Box>
          )}
        </Paper>
      </Container>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Member</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={selectedMember?.name || ""}
            onChange={(e) => handleEditChange("name", e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={selectedMember?.email || ""}
            onChange={(e) => handleEditChange("email", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Household;
