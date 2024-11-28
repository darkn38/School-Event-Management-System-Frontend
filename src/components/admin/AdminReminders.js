import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import './AdminReminders.css';

const AdminReminders = () => {
    const [events, setEvents] = useState([]);

    const apiUrlEvents = 'http://localhost:8080/events';

    // Fetch events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(apiUrlEvents, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    // Group events by date
    const groupedEvents = events.reduce((acc, event) => {
        const date = event.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {});

    return (
        <Container className="admin-reminders-page">
            <Typography variant="h3" align="center" gutterBottom>
                Upcoming Events Reminder
            </Typography>

            {/* Events grouped by date */}
            {Object.keys(groupedEvents).map((date) => (
                <TableContainer component={Paper} className="grouped-events" key={date}>
                    <Typography className="date-header">{date}</Typography>
                    <Table className="grouped-events-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Event Name</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groupedEvents[date].map((event) => (
                                <TableRow key={event.event_id}>
                                    <TableCell>{event.event_name}</TableCell>
                                    <TableCell>{event.location}</TableCell>
                                    <TableCell>{event.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ))}
        </Container>
    );
};

export default AdminReminders;
