import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import axios from 'axios';
import './AdminEvents.css';

// Styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#6c757d', // Bootstrap secondary color
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: 'black',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#e9ecef', // Bootstrap light color
  '&:nth-of-type(odd)': {
    backgroundColor: '#f8f9fa', // Bootstrap lighter color
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    eventName: '',
    eventType: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogAction, setDialogAction] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [editSuccessDialogOpen, setEditSuccessDialogOpen] = useState(false);

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const openDialog = (message, action, eventId) => {
    setDialogMessage(message);
    setDialogAction(() => action);
    setSelectedEventId(eventId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogMessage('');
    setDialogAction(null);
    setSelectedEventId(null);
  };

  // Handle confirming the dialog action
  const handleDialogConfirm = () => {
    if (dialogAction) {
      dialogAction(selectedEventId);
    }
    handleDialogClose();
  };

  // Handle approving an event
  const handleApprove = async (eventID) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to approve an event.');
        return;
      }
      const response = await axios.put(
        `http://localhost:8080/events/${eventID}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status >= 200 && response.status < 300) {
        const updatedEvents = events.map((event) =>
          event.eventID === eventID ? { ...event, approvalStatus: 'APPROVED' } : event
        );
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  // Handle rejecting an event
  const handleReject = async (eventID) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to reject an event.');
        return;
      }
      const response = await axios.put(
        `http://localhost:8080/events/${eventID}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status >= 200 && response.status < 300) {
        const updatedEvents = events.map((event) =>
          event.eventID === eventID ? { ...event, approvalStatus: 'REJECTED' } : event
        );
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };

  // Handle deleting an event
  const handleDelete = async (eventID) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to delete an event.');
        return;
      }
      const response = await axios.delete(`http://localhost:8080/events/${eventID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status >= 200 && response.status < 300) {
        const updatedEvents = events.filter((event) => event.eventID !== eventID);
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEditClick = (event) => {
    setEditEventId(event.eventID);
    setEditFormData({
      eventName: event.eventName,
      eventType: event.eventType,
      date: event.date ? event.date.substring(0, 10) : '',
      time: event.time ? event.time.substring(0, 5) : '',
      location: event.location,
      description: event.description,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to edit an event.');
        return;
      }
      const response = await axios.put(
        `http://localhost:8080/events/${editEventId}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status >= 200 && response.status < 300) {
        const updatedEvents = events.map((event) =>
          event.eventID === editEventId ? { ...event, ...editFormData } : event
        );
        setEvents(updatedEvents);
        setEditEventId(null);
        setEditSuccessDialogOpen(true); // Open the success dialog
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };
  

  const handleCancelClick = () => {
    setEditEventId(null);
  };

  const pendingAndRejectedEvents = events.filter(
    (event) => event.approvalStatus === 'PENDING' || event.approvalStatus === 'REJECTED'
  );

  const approvedEvents = events.filter((event) => event.approvalStatus === 'APPROVED');

  return (
    <div className="admin-events-container" style={{ marginLeft: '250px', padding: '20px' }}>
      <h2>Event Management</h2>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDialogConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editSuccessDialogOpen} onClose={() => setEditSuccessDialogOpen(false)}>
  <DialogTitle>Changes Saved</DialogTitle>
  <DialogContent>
    <DialogContentText>
      The changes have been successfully saved.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setEditSuccessDialogOpen(false)} color="primary">
      OK
    </Button>
  </DialogActions>
</Dialog>


      <h3>Pending/Rejected Events</h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="pending and rejected events">
          <TableHead>
            <TableRow>
              <StyledTableCell>Event Name</StyledTableCell>
              <StyledTableCell>Event Type</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Time</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Created By</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {pendingAndRejectedEvents.map((event) => (
    <StyledTableRow key={event.eventID}>
      <StyledTableCell>{event.eventName}</StyledTableCell>
      <StyledTableCell>{event.eventType}</StyledTableCell>
      <StyledTableCell>
        {event.date ? new Date(event.date).toLocaleDateString() : ''}
      </StyledTableCell>
      <StyledTableCell>
        {event.time ? event.time.substring(0, 5) : ''}
      </StyledTableCell>
      <StyledTableCell>{event.location}</StyledTableCell>
      <StyledTableCell>{event.description}</StyledTableCell>
      <StyledTableCell>{event.createdBy || 'N/A'}</StyledTableCell>
      <StyledTableCell>{event.approvalStatus || 'PENDING'}</StyledTableCell>
      <StyledTableCell>
        <Button
          onClick={() => openDialog('Approve this event?', handleApprove, event.eventID)}
          variant="contained"
          color="success"
          size="small"
          style={{ marginRight: '5px' }}
          disabled={event.approvalStatus === 'REJECTED'} // Disable if the event is rejected
        >
          Approve
        </Button>
        <Button
          onClick={() => openDialog('Reject this event?', handleReject, event.eventID)}
          variant="contained"
          color="error"
          size="small"
          style={{ marginRight: '5px' }}
        >
          Reject
        </Button>
        <Button
          onClick={() => openDialog('Delete this event?', handleDelete, event.eventID)}
          variant="contained"
          color="error"
          size="small"
        >
          Delete
        </Button>
      </StyledTableCell>
    </StyledTableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>

      <h3>Approved Events</h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="approved events">
          <TableHead>
            <TableRow>
              <StyledTableCell>Event Name</StyledTableCell>
              <StyledTableCell>Event Type</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Time</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Created By</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvedEvents.map((event) => (
              <StyledTableRow key={event.eventID}>
                <StyledTableCell>
                  {editEventId === event.eventID ? (
                    <TextField
                      name="eventName"
                      value={editFormData.eventName}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    event.eventName
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {editEventId === event.eventID ? (
                    <TextField
                      name="eventType"
                      value={editFormData.eventType}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    event.eventType
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {editEventId === event.eventID ? (
                    <TextField
                      name="date"
                      type="date"
                      value={editFormData.date}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    event.date ? new Date(event.date).toLocaleDateString() : ''
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {editEventId === event.eventID ? (
                    <TextField
                      name="time"
                      type="time"
                      value={editFormData.time}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    event.time ? event.time.substring(0, 5) : ''
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {editEventId === event.eventID ? (
                    <TextField
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    event.location
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {editEventId === event.eventID ? (
                    <TextField
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    event.description
                  )}
                </StyledTableCell>
                <StyledTableCell>{event.createdBy || 'N/A'}</StyledTableCell>
                <StyledTableCell>
                  {editEventId === event.eventID ? (
                    <>
                      <Button
                        onClick={handleSaveClick}
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginRight: '5px' }}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelClick}
                        variant="contained"
                        color="secondary"
                        size="small"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleEditClick(event)}
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginRight: '5px' }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => openDialog('Delete this event?', handleDelete, event.eventID)}
                        variant="contained"
                        color="error"
                        size="small"
                      >
                        Delete
                      </Button>
                    </>
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
