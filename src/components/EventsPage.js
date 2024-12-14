import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Alert,
    Select,
    MenuItem,
    CardMedia,
    Box,
    TextField
} from '@mui/material';
import './EventsPage.css';
import academicImage from '../images/img1.jpg';
import sportsImage from '../images/img2.jpg';
import culturalImage from '../images/img3.jpg';
import miscImage from '../images/img4.jpg';
import defaultImage from '../images/2_event.jpg';

// Mapping of event types to images
const eventTypeImages = {
    'Academic Events': academicImage,
    'Sports Events': sportsImage,
    'Cultural Events': culturalImage,
    'Miscellaneous Events': miscImage,
};

// Free event types
const freeEventTypes = ['Academic Events', 'Cultural Events', 'Sports Events']; // Sports Events are free now

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [ticketType, setTicketType] = useState('Standard');
    const [paymentStatus] = useState('Paid');
    const [openDialog, setOpenDialog] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [paymentMethod, setPaymentMethod] = useState('GCash'); // Payment method dropdown
    const [paymentDetails, setPaymentDetails] = useState(''); // GCash/Card number input
    const [paymentAmount, setPaymentAmount] = useState(''); // Input for amount
    const [errorMessage, setErrorMessage] = useState(''); // Error messaging
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');


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
    
                const currentDate = new Date();
                const filteredEvents = response.data.filter((event) => {
                    const eventDate = new Date(event.date);
                    // Filter for APPROVED events only
                    return eventDate >= currentDate && event.approvalStatus === 'APPROVED';
                });
    
                const eventsWithImages = filteredEvents.map((event) => ({
                    ...event,
                    imageUrl: eventTypeImages[event.eventType] || defaultImage,
                }));
    
                setEvents(eventsWithImages);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
    
        fetchEvents();
    }, []);
    

    // Handles opening the details dialog
    const handleDetailsClick = (event) => {
        setSelectedEvent(event);
        setDetailsDialogOpen(true);
    };
    const handlePaymentSubmission = () => {
        const baseAmount = 250; // Base payment for Standard tickets
        const vipSurcharge = 200; // Additional charge for VIP tickets
        const requiredAmount = ticketType === 'VIP' ? baseAmount + vipSurcharge : baseAmount;
    
        // Validate payment amount
        if (parseInt(paymentAmount) < requiredAmount) {
            setErrorMessage(`Amount must be at least PHP ${requiredAmount}.`);
            return;
        } else if (parseInt(paymentAmount) > requiredAmount) {
            setErrorMessage(`Amount exceeds the required PHP ${requiredAmount}. Please enter the exact amount.`);
            return;
        }
    
        // Clear errors and proceed with registration
        setErrorMessage('');
        handleMockPaymentRegistration(); // Continue to the mock registration function
    };
    

    // Handles registration for free and paid events
    const handleRegisterClick = async (event) => {
        const token = localStorage.getItem('token');
        const userID = localStorage.getItem('userID');
    
        if (!token || !userID) {
            console.error('No token or userID found');
            setSnackbarMessage('Authentication failed. Please log in again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        // Check if the event is free or paid first
        if (freeEventTypes.includes(event.eventType)) {
            try {
                // Register directly for free events
                const registerResponse = await axios.post(
                    'http://localhost:8080/api/eventregistrations/register',
                    { userID, eventID: event.eventID }, // Use JSON body
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
    
                if (registerResponse.status === 200) {
                    setSuccessMessage(`Successfully registered for ${event.eventName}!`);
                    setSuccessDialogOpen(true); // Open success dialog
                }
            } catch (error) {
                console.error('Error during registration for free event:', error);
                setSnackbarMessage('You are already registered for this event.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
            return;
        }else {
            // Check registration status for all events
    try {
        const checkResponse = await axios.post(
            `http://localhost:8080/api/eventregistrations/check`,
            {
                params: { userID, eventID: event.eventID },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Handle already registered response
        if (checkResponse.data === true) {
            setSnackbarMessage('You are already registered for this event.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
        }
    } catch (error) {
        console.error('Error checking registration status:', error);
    }
            setSelectedEvent(event);
            setOpenDialog(true);
        }
    };
    
    
    
    // Handle mock payment registration for paid events
    const handleMockPaymentRegistration = async () => {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');
        if (!token || !userEmail) {
            console.error('No token or user email found');
            setSnackbarMessage('Authentication failed. Please log in again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
    
        try {
            const response = await axios.post(
                'http://localhost:8080/api/eventregistrations',
                {
                    eventId: selectedEvent.eventID,
                    ticketType,
                    paymentStatus,
                    emailAddress: userEmail,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                setSnackbarMessage(`Successfully registered for ${selectedEvent.eventName} with ${ticketType} ticket!`);
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
                    <Grid item xs={12} sm={6} md={4} key={event.eventID}>
                        <Card
                            sx={{
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-10px)',
                                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                                },
                                borderRadius: '16px',
                                overflow: 'hidden',
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="180"
                                image={event.imageUrl || defaultImage}
                                alt={event.eventName}
                            />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {event.eventName}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    {event.date}
                                </Typography>
                                <Typography color="textSecondary">
                                    Location: {event.location}
                                </Typography>
                                <Typography 
                                    variant="subtitle1" 
                                    color={freeEventTypes.includes(event.eventType) ? "green" : "red"}
                                    sx={{ marginTop: '8px' }}
                                    >
                                    {freeEventTypes.includes(event.eventType) ? "Free" : "Paid"}
                                </Typography>
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#fcd404',
                                            color: '#000',
                                            '&:hover': {
                                                backgroundColor: '#e6bf02',
                                            },
                                            margin: '8px',
                                        }}
                                        onClick={() => handleDetailsClick(event)}
                                    >
                                        Details
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#fcd404',
                                            color: '#000',
                                            '&:hover': {
                                                backgroundColor: '#e6bf02',
                                            },
                                            margin: '8px',
                                        }}
                                        onClick={() => handleRegisterClick(event)}
                                    >
                                        Register
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)}>
                <DialogTitle>Event Details</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <strong>Name:</strong> {selectedEvent?.eventName}
                        <br />
                        <strong>Date:</strong> {selectedEvent?.date}
                        <br />
                        <strong>Location:</strong> {selectedEvent?.location}
                        <br />
                        <strong>Description:</strong> {selectedEvent?.description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsDialogOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
    <DialogTitle>Payment for {selectedEvent?.eventName}</DialogTitle>
    <DialogContent>
        {/* Ticket Type Selection */}
        <DialogContentText>Choose your ticket type:</DialogContentText>
        <Select
            fullWidth
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
            sx={{ marginTop: '16px' }}
        >
            <MenuItem value="Standard">Standard</MenuItem>
            <MenuItem value="VIP">VIP</MenuItem>
        </Select>

        {/* Payment Method Selection */}
        <DialogContentText sx={{ marginTop: '16px' }}>Pay With:</DialogContentText>
        <Select
            fullWidth
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ marginTop: '16px' }}
        >
            <MenuItem value="GCash">GCash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
        </Select>

        {/* Conditional Payment Details Input */}
        {paymentMethod === 'GCash' && (
            <TextField
                fullWidth
                label="Enter GCash Number"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                sx={{ marginTop: '16px' }}
            />
        )}
        {paymentMethod === 'Card' && (
            <TextField
                fullWidth
                label="Enter Card Number"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                sx={{ marginTop: '16px' }}
            />
        )}

        {/* Fixed Payment Amount and Input for Validation */}
        <DialogContentText sx={{ marginTop: '16px' }}>
            <strong>{ticketType === 'VIP' ? 'VIP = 450' : 'Standard = 250'}</strong>
        </DialogContentText>

        <TextField
            fullWidth
            type="number"
            label="Enter Payment Amount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            sx={{ marginTop: '16px' }}
        />
        {errorMessage && (
            <Typography color="error" sx={{ marginTop: '8px' }}>
                {errorMessage}
            </Typography>
        )}
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button
            variant="contained"
            color="primary"
            onClick={handlePaymentSubmission}
        >
            PAY
        </Button>
    </DialogActions>
</Dialog>


            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {/* Success Dialog */}
        <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
            <DialogTitle>Registration Successful</DialogTitle>
            <DialogContent>
                <DialogContentText>{successMessage}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setSuccessDialogOpen(false)} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
        </Container>
    );
};

export default EventsPage;
