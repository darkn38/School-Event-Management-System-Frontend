import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, Select, MenuItem } from '@mui/material';
import './EventsPage.css';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [ticketType, setTicketType] = useState("Standard");
    const [paymentStatus, setPaymentStatus] = useState("Paid");
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Fetch events from the backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    console.error('No token found');
                    return;
                }

                const response = await axios.get('http://localhost:8080/events', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    // Handle selecting an event for registration
    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setOpenDialog(true);
    };

    // Handle user registration
const handleRegistration = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    const userEmail = localStorage.getItem('userEmail'); // Retrieve user email from localStorage

    if (!token || !userEmail) {
        console.error("No token or user email found");
        setSnackbarMessage('Authentication failed. Please log in again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
    }

    try {
        const response = await axios.post(
            'http://localhost:8080/api/eventregistrations',
            {
                eventId: selectedEvent.event_id,
                ticketType: ticketType,
                paymentStatus: paymentStatus,
                emailAddress: userEmail, // Include email in the request body
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include token in the request headers
                },
            }
        );

        if (response.status === 200) {
            setSnackbarMessage(`Registration for ${selectedEvent.event_name} was successful!`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        setSnackbarMessage('Registration failed. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
    }
    setOpenDialog(false);
};


    // Handle closing snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container>
            <Typography variant="h3" align="center" gutterBottom>
                Upcoming Events
            </Typography>

            <Grid container spacing={4}>
                {events.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event.event_id}>
                        <Card onClick={() => handleEventSelect(event)} sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {event.event_name}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    Date: {event.date}
                                </Typography>
                                <Typography color="textSecondary">
                                    Location: {event.location}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {event.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Registration Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Register for {selectedEvent?.event_name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please select your ticket type and payment status to register for this event.
                    </DialogContentText>
                    <Select
                        fullWidth
                        value={ticketType}
                        onChange={(e) => setTicketType(e.target.value)}
                        label="Ticket Type"
                        sx={{ marginTop: '16px' }}
                    >
                        <MenuItem value="Standard">Standard</MenuItem>
                        <MenuItem value="VIP">VIP</MenuItem>
                    </Select>
                    <Select
                        fullWidth
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        label="Payment Status"
                        sx={{ marginTop: '16px' }}
                    >
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Unpaid">Unpaid</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleRegistration} variant="contained" color="primary">
                        Register
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default EventsPage;
