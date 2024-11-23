import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import axios from 'axios';
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
  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    event_name: '',
    date: '',
    location: '',
    description: '',
  });

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

  // Handle deleting an event
  const handleDelete = async (eventId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/events/${eventId}`);
      if (response.status >= 200 && response.status < 300) {
        const updatedEvents = events.filter((event) => event.event_id !== eventId);
        setEvents(updatedEvents);
      } else {
        console.error('Error deleting event:', response);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Handle clicking the Edit button
  const handleEditClick = (event) => {
    setEditEventId(event.event_id);
    setEditFormData({
      event_name: event.event_name,
      date: event.date,
      location: event.location,
      description: event.description,
    });
  };

  // Handle input field changes during edit
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle saving the changes made during editing
  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/events/${editEventId}`, editFormData);
      if (response.status >= 200 && response.status < 300) {
        // Update the specific event in the state with the new edited values
        const updatedEvents = events.map((event) =>
          event.event_id === editEventId ? { ...event, ...editFormData } : event
        );
        setEvents(updatedEvents);
        setEditEventId(null); // Exit edit mode after saving
      } else {
        console.error('Error updating event:', response);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  // Handle cancelling the edit
  const handleCancelClick = () => {
    setEditEventId(null);
  };

  return (
    <div className="admin-events-container" style={{ marginLeft: '250px', padding: '20px' }}>
      <h2>Event Management</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="event management table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Event Name</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <StyledTableRow key={event.event_id}>
                <StyledTableCell>
                  {editEventId === event.event_id ? (
                    <TextField
                      name="event_name"
                      value={editFormData.event_name}
                      onChange={handleEditFormChange}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    event.event_name
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {editEventId === event.event_id ? (
                    <TextField
                      name="date"
                      value={editFormData.date}
                      onChange={handleEditFormChange}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    event.date
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {editEventId === event.event_id ? (
                    <TextField
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditFormChange}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    event.location
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {editEventId === event.event_id ? (
                    <TextField
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditFormChange}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    event.description
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {editEventId === event.event_id ? (
                    <>
                      <Button
                        className="save-button"
                        onClick={handleSaveClick}
                        variant="contained"
                        color="primary"
                      >
                        Save
                      </Button>
                      <Button
                        className="cancel-button"
                        onClick={handleCancelClick}
                        variant="contained"
                        color="secondary"
                        style={{ marginLeft: '10px' }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="edit-button"
                        onClick={() => handleEditClick(event)}
                        variant="contained"
                        color="warning"
                      >
                        Edit
                      </Button>
                      <Button
                        className="delete-button"
                        onClick={() => handleDelete(event.event_id)}
                        variant="contained"
                        color="error"
                        style={{ marginLeft: '10px' }}
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