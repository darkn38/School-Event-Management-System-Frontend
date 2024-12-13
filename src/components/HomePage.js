import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for navigation
import './HomePage.css';
import axios from 'axios';

// Import images
import academicImage from '../images/img1.jpg';
import sportsImage from '../images/img2.jpg';
import culturalImage from '../images/img3.jpg';
import miscImage from '../images/img4.jpg';
import defaultImage from '../images/2_event.jpg';

// Event type to image mapping
const eventTypeImages = {
    'Academic Events': academicImage,
    'Sports Events': sportsImage,
    'Cultural Events': culturalImage,
    'Miscellaneous Events': miscImage,
};

const HomePage = () => {
    const [eventType, setEventType] = useState('');
    const [location, setLocation] = useState('');
    const [upcomingEvents, setUpcomingEvents] = useState([]); // State for upcoming events
    const navigate = useNavigate();

    const eventTypes = ['Academic Events', 'Sports Events', 'Cultural Events', 'Miscellaneous Events'];
    const locations = ['CIT', 'NGE', 'RTL', 'SAL', 'GLE'];

    // Fetch upcoming events
    useEffect(() => {
        const fetchUpcomingEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8080/events/upcoming', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUpcomingEvents(response.data.slice(0, 3)); // Limit to 3 events for the homepage
            } catch (error) {
                console.error('Error fetching upcoming events:', error);
            }
        };

        fetchUpcomingEvents();
    }, []);

    const handleSearch = () => {
        if (!eventType && !location) {
            alert('Please select an event type or a location.');
            return;
        }
    
        const searchCriteria = {
            eventType: eventType || null,
            location: location || null,
        };
    
        // Navigate to the search results page with the selected criteria
        navigate('/search-results', { state: { ...searchCriteria } });
    };
    

    return (
        <div className="homepage-container">
            <section className="hero-section">
                <div className="hero-text">
                    <h1>MADE FOR THOSE WHO DO</h1>
                    <p>Discover exciting events and manage your own.</p>
                </div>
            </section>

            {/* Filter Bar Below Hero Section */}
            <section className="filter-bar">
                <div className="filter-option">
                    <label>Looking for</label>
                    <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                        <option value="" disabled>
                            Choose event type
                        </option>
                        {eventTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="filter-option">
                    <label>Location</label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)}>
                        <option value="" disabled>
                            Choose location
                        </option>
                        {locations.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="search-button" onClick={handleSearch}>
                    Search
                </button>
            </section>

            {/* Upcoming Events Section */}
            <section className="popular-events">
                <h2>Upcoming Events</h2>
                <div className="event-cards">
                    {upcomingEvents.map((event, index) => (
                        <div className="event-card" key={index}>
                            <img
                                src={eventTypeImages[event.eventType] || defaultImage}
                                alt={event.eventName}
                                className="event-image"
                            />
                            <h3>{event.eventName}</h3>
                            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                            <p>Time: {event.time}</p>
                            <p>Location: {event.location}</p>
                            <Link
                                to={`/events`} // Link to event details page
                                className="learn-more-button"
                            >
                                Learn More
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
