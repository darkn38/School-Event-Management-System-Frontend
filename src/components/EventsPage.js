import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';
import './EventsPage.css';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
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
        
        if (!token) {
            console.error("No token found");
            setSnackbarMessage('Authentication failed. Please log in again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
    
        try {
            const response = await axios.post(
                'http://localhost:8080/eventregistrations',
                {
                    eventId: selectedEvent.event_id,
                    name: userInfo.name,
                    email: userInfo.email,
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
                setPaymentSuccess(true);
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
                        Please fill in your details to register for this event.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Your Name"
                        type="text"
                        fullWidth
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Your Email"
                        type="email"
                        fullWidth
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    />
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

            {paymentSuccess && (
                <Typography variant="h5" align="center" sx={{ marginTop: '40px' }}>
                    Your registration for {selectedEvent.event_name} is complete! We look forward to seeing you at the event.
                </Typography>
            )}
        </Container>
    );
};

export default EventsPage;
