import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CreatePage.css'; // Link to CSS file
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const CreateEventPage = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState({
        event_id: 0,
        date: '',
        description: '',
        event_name: '',
        event_type: '',
        location: '',
        time: '',
    });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const eventTypes = ['Academic Events', 'Sports Events', 'Cultural Events', 'Miscellaneous Events'];
    const locations = ['CIT', 'NGE', 'RTL', 'SAL', 'GLE'];

    useEffect(() => {
        if (eventId) {
            fetchEvent(eventId);
        }
    }, [eventId]);

    const fetchEvent = async (eventId) => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            const response = await axios.get(`http://localhost:8080/events/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEvent(response.data);
        } catch (error) {
            console.error('Error fetching event:', error);
        }
    };

    const handleChange = (e) => {
        setEvent({ ...event, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            if (eventId) {
                // Update existing event
                await axios.put(`http://localhost:8080/events/${eventId}`, {
                    date: event.date,
                    description: event.description,
                    event_name: event.event_name,
                    event_type: event.event_type,
                    location: event.location,
                    time: event.time,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // Create new event
                await axios.post('http://localhost:8080/events', {
                    date: event.date,
                    description: event.description,
                    event_name: event.event_name,
                    event_type: event.event_type,
                    location: event.location,
                    time: event.time,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                setDialogOpen(true);
            }, 500);
        } catch (error) {
            console.error('Error creating/updating event:', error);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false); // Close the success dialog without redirection
    };

    return (
        <div className="create-event-page">
            <section className="create-event-content">
                <h1>{eventId ? 'Edit Event' : 'Create New Event'}</h1>
                {showSuccessMessage && (
                    <div className="alert alert-success" role="alert">
                        Event {eventId ? 'updated' : 'created'} successfully!
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="event_name"
                        placeholder="Event Name"
                        value={event.event_name}
                        onChange={handleChange}
                        required
                    />
                    
                    {/* Event Type Dropdown */}
                    <select
                        name="event_type"
                        value={event.event_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select Event Type
                        </option>
                        {eventTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    
                    <input
                        type="date"
                        name="date"
                        value={event.date}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="time"
                        name="time"
                        value={event.time}
                        onChange={handleChange}
                        required
                    />
                    
                    {/* Location Dropdown */}
                    <select
                        name="location"
                        value={event.location}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select Location
                        </option>
                        {locations.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>
                    
                    <textarea
                        name="description"
                        placeholder="Event Description"
                        value={event.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                    
                    <button type="submit" className="create-event-button">
                        {eventId ? 'Update Event' : 'Create Event'}
                    </button>
                </form>
                <Dialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Event Created Successfully"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            The event has been created successfully.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </section>
        </div>
    );
};

export default CreateEventPage;
