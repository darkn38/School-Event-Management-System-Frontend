import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell'; // <-- Import missing here
import './AdminEvents.css';

// Styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const AdminEvents = () => {
  // Dummy data for events
  const events = [
    { userName: 'John Doe', eventName: 'Science Fair', status: 'Pending', id: 1 },
    { userName: 'Jane Smith', eventName: 'Math Olympiad', status: 'Approved', id: 2 },
    { userName: 'David Lee', eventName: 'Art Exhibition', status: 'Pending', id: 3 },
    { userName: 'Emily Wang', eventName: 'Coding Contest', status: 'Approved', id: 4 },
  ];

  return (
    <div className="admin-events-container" style={{ marginLeft: '250px', padding: '20px' }}>
      <h2>Event Management</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="event management table">
          <TableHead>
            <TableRow>
              <StyledTableCell>User Name</StyledTableCell>
              <StyledTableCell>Event Name</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <StyledTableRow key={event.id}>
                <StyledTableCell>{event.userName}</StyledTableCell>
                <StyledTableCell>{event.eventName}</StyledTableCell>
                <StyledTableCell>{event.status}</StyledTableCell>
                <StyledTableCell>
                  {event.status === 'Pending' ? (
                    <CheckCircle style={{ color: 'green', cursor: 'pointer' }} />
                  ) : (
                    <Cancel style={{ color: 'red', cursor: 'pointer' }} />
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminEvents;
