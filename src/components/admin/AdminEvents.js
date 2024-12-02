// AdminEvents.js

import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField,
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
  // Hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    event_id: '',
    event_name: '',
    event_type: '',
    date: '',
    time: '',
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
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found in localStorage');
        alert('You must be logged in to delete an event.');
        return;
      }

      // Log the token to ensure it's retrieved
      console.log('JWT Token:', token);

      const response = await axios.delete(`http://localhost:8080/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        const updatedEvents = events.filter((event) => event.event_id !== eventId);
        setEvents(updatedEvents);
        alert('Event deleted successfully!');
      } else {
        console.error('Error deleting event:', response);
        alert('Failed to delete event.');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        alert(`Error deleting event: ${error.response.status} ${error.response.statusText}`);
      } else {
        alert('An error occurred while deleting the event.');
      }
    }
  };

  // Handle clicking the Edit button
  const handleEditClick = (event) => {
    setEditEventId(event.event_id);
    setEditFormData({
      event_id: event.event_id,
      event_name: event.event_name,
      event_type: event.event_type,
      date: event.date ? event.date.substring(0, 10) : '',
      time: event.time ? event.time.substring(0, 5) : '',
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
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found in localStorage');
        alert('You must be logged in to edit an event.');
        return;
      }

      // Log the data being sent
      console.log('Sending editFormData:', editFormData);

      const response = await axios.put(
        `http://localhost:8080/events/${editEventId}`,
        editFormData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        // Update the specific event in the state with the new edited values
        const updatedEvents = events.map((event) =>
          event.event_id === editEventId ? { ...event, ...editFormData } : event
        );
        setEvents(updatedEvents);
        setEditEventId(null); // Exit edit mode after saving
        alert('Event updated successfully!');
      } else {
        console.error('Error updating event:', response);
        alert('Failed to update event.');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        alert(`Error updating event: ${error.response.status} ${error.response.statusText}`);
      } else {
        alert('An error occurred while updating the event.');
      }
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
              <StyledTableCell>Event Type</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Time</StyledTableCell>
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
                      name="event_type"
                      value={editFormData.event_type}
                      onChange={handleEditFormChange}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    event.event_type
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {editEventId === event.event_id ? (
                    <TextField
                      name="date"
                      type="date"
                      value={editFormData.date}
                      onChange={handleEditFormChange}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    event.date ? new Date(event.date).toLocaleDateString() : ''
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {editEventId === event.event_id ? (
                    <TextField
                      name="time"
                      type="time"
                      value={editFormData.time}
                      onChange={handleEditFormChange}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    event.time ? event.time.substring(0, 5) : ''
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
                        onClick={handleSaveClick}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelClick}
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ marginLeft: '10px' }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleEditClick(event)}
                        variant="contained"
                        color="warning"
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(event.event_id)}
                        variant="contained"
                        color="error"
                        size="small"
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
