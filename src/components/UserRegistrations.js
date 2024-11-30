import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

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

const UserRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
  });
  const userID = localStorage.getItem("userID"); // Fetch userID from local storage

  useEffect(() => {
    const fetchUserDetailsAndRegistrations = async () => {
      const token = localStorage.getItem("token");

      try {
        // Fetch current user details
        const userResponse = await axios.get("http://localhost:8080/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        // Fetch current user registrations
        const registrationsResponse = await axios.get(
          `http://localhost:8080/api/eventregistrations/user/${userID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRegistrations(registrationsResponse.data);
      } catch (error) {
        console.error("Error fetching user details or registrations:", error);
      }
    };

    fetchUserDetailsAndRegistrations();
  }, [userID]);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Your Event Registrations
      </Typography>

      {/* Display User Details */}
      <Box
        sx={{
          backgroundColor: "#f4f4f4",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" gutterBottom>
          User Details
        </Typography>
        <Typography>
          <strong>First Name:</strong> {user.firstName || "N/A"}
        </Typography>
        <Typography>
          <strong>Last Name:</strong> {user.lastName || "N/A"}
        </Typography>
        <Typography>
          <strong>Email:</strong> {user.emailAddress || "N/A"}
        </Typography>
      </Box>

      {/* Event Registrations Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Event Name</StyledTableCell>
              <StyledTableCell>Registration Date</StyledTableCell>
              <StyledTableCell>Ticket Type</StyledTableCell>
              <StyledTableCell>Payment Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrations.map((reg) => (
              <StyledTableRow key={reg.registrationID}>
                <StyledTableCell>{reg.event.event_name}</StyledTableCell>
                <StyledTableCell>{reg.registrationDate}</StyledTableCell>
                <StyledTableCell>{reg.ticketType}</StyledTableCell>
                <StyledTableCell>{reg.paymentStatus}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserRegistrations;
