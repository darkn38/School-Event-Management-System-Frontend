import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventType, location: eventLocation } = location.state || {};
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch search results from the backend
  const fetchSearchResults = useCallback(async () => {
    if (!eventType && !eventLocation) {
      setError('Please provide at least an event type or a location.');
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (!token) {
        throw new Error('Authorization token is missing.');
      }

      // Fetch events from the backend with appropriate filters
      const response = await axios.get(`http://localhost:8080/events/search`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        params: {
          eventType: eventType || null,
          location: eventLocation || null,
        },
      });

      if (typeof response.data === 'string') {
        // If the backend returns a string message, set it as an error
        setError(response.data);
        setEvents([]);
      } else {
        // Filter events for upcoming dates and approved events
        const currentDate = new Date();
        const filteredEvents = response.data.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= currentDate && event.approvalStatus === 'APPROVED'; // Only include upcoming and approved events
        });

        if (filteredEvents.length === 0) {
          setError('No events found matching your criteria.');
        }

        setEvents(filteredEvents);
      }
    } catch (err) {
      console.error('Error fetching search results:', err); // Debugging
      setError('Failed to fetch search results. Please try again later.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [eventType, eventLocation]);

  // Trigger search results fetch on component mount
  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  const handleLearnMore = () => {
    navigate('/events'); // Redirect to /events
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Search Results
      </Typography>

      {/* Loading State */}
      {loading && (
        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
          <CircularProgress />
        </Grid>
      )}

      {/* Error State */}
      {error && (
        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}

      {/* Event List */}
      {!loading && !error && events.length > 0 && (
        <Grid container spacing={4} style={{ marginTop: '20px' }}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.eventID}>
              <Card style={{ backgroundColor: '#f9f9f9', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.eventName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {event.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                    <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Time:</strong> {event.time}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Location:</strong> {event.location}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={handleLearnMore}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* No Events Found */}
      {!loading && !error && events.length === 0 && (
        <Typography variant="h6" align="center" color="textSecondary" style={{ marginTop: '20px' }}>
          No events found matching your criteria.
        </Typography>
      )}
    </Container>
  );
};

export default SearchResultsPage;
