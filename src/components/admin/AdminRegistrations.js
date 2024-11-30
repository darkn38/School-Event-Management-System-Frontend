import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import "./AdminRegistrations.css"; // Scoped CSS

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  "&.MuiTableCell-body": {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [registration, setRegistration] = useState({
    userId: "",
    eventId: "",
    paymentStatus: "",
    registrationDate: "",
    ticketType: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const apiUrl = "http://localhost:8080/api/eventregistrations";

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistrations(response.data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Add emailAddress to the registration object
    const updatedRegistration = {
      ...registration,
      emailAddress: "janedoe@example.com", // Replace this with dynamic email if needed
    };

    try {
      if (editMode) {
        await axios.put(`${apiUrl}/${currentId}`, updatedRegistration, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(apiUrl, updatedRegistration, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchRegistrations();
      setRegistration({
        userId: "",
        eventId: "",
        paymentStatus: "",
        registrationDate: "",
        ticketType: "",
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error saving registration:", error);
    }
  };

  const handleEdit = (reg) => {
    setRegistration({
      userId: reg.user.userID,
      eventId: reg.event.event_id,
      paymentStatus: reg.paymentStatus,
      registrationDate: reg.registrationDate,
      ticketType: reg.ticketType,
    });
    setEditMode(true);
    setCurrentId(reg.registrationID);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${apiUrl}/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRegistrations();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting registration:", error);
      setOpenDialog(false);
    }
  };

  return (
    <div className="admin-registrations-container">
      <h2>Event Registrations</h2>
      <form
        onSubmit={handleSubmit}
        className="registration-form"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <TextField
          label="User ID"
          value={registration.userId}
          onChange={(e) =>
            setRegistration({ ...registration, userId: e.target.value })
          }
          required
        />
        <TextField
          label="Event ID"
          value={registration.eventId}
          onChange={(e) =>
            setRegistration({ ...registration, eventId: e.target.value })
          }
          required
        />
        <TextField
          label="Payment Status"
          select
          value={registration.paymentStatus}
          onChange={(e) =>
            setRegistration({ ...registration, paymentStatus: e.target.value })
          }
          required
        >
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </TextField>
        <TextField
          label="Registration Date"
          type="date"
          value={registration.registrationDate}
          onChange={(e) =>
            setRegistration({
              ...registration,
              registrationDate: e.target.value,
            })
          }
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Ticket Type"
          value={registration.ticketType}
          onChange={(e) =>
            setRegistration({ ...registration, ticketType: e.target.value })
          }
          required
        />
        <Button variant="contained"style={{backgroundColor: "#ffa500",color: "white",}}
            type="submit"
        >
            {editMode ? "Update Registration" : "Add Registration"}
        </Button>
      </form>

      <TableContainer component={Paper}>
  <Table sx={{ minWidth: 700 }} aria-label="customized table">
    <TableHead>
      <TableRow>
        <StyledTableCell>First Name</StyledTableCell>
        <StyledTableCell>Last Name</StyledTableCell>
        <StyledTableCell>Email</StyledTableCell>
        <StyledTableCell>Event Name</StyledTableCell>
        <StyledTableCell>Registration Date</StyledTableCell>
        <StyledTableCell>Ticket Type</StyledTableCell>
        <StyledTableCell>Payment Status</StyledTableCell>
        <StyledTableCell>Actions</StyledTableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {registrations.map((reg) => (
        <StyledTableRow key={reg.registrationID}>
          <StyledTableCell>{reg.user.firstName}</StyledTableCell>
          <StyledTableCell>{reg.user.lastName}</StyledTableCell>
          <StyledTableCell>{reg.user.emailAddress}</StyledTableCell>
          <StyledTableCell>{reg.event.event_name}</StyledTableCell>
          <StyledTableCell>{reg.registrationDate}</StyledTableCell>
          <StyledTableCell>{reg.ticketType}</StyledTableCell>
          <StyledTableCell>{reg.paymentStatus}</StyledTableCell>
          <StyledTableCell>
            <button
              onClick={() => handleEdit(reg)}
              className="edit-button"
            >
              Edit
            </button>
            <button
              onClick={() => confirmDelete(reg.registrationID)}
              className="delete-button"
            >
              Delete
            </button>
          </StyledTableCell>
        </StyledTableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this registration? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminRegistrations;
