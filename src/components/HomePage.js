import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const [eventType, setEventType] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    const eventTypes = ['Academic Events', 'Sports Events', 'Cultural Events', 'Miscellaneous Events'];
    const locations = ['CIT', 'NGE', 'RTL', 'SAL', 'GLE'];

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        console.log('Role from localStorage:', role); // Debugging user role
    }, []);

    const handleSearch = () => {
        if (eventType && location) {
            console.log('Navigating to /search-results with:', { eventType, location });
            navigate('/search-results', { state: { eventType, location } });
        } else {
            alert('Please select both an event type and a location.');
        }
    };    

    return (
        <div className="home-page">
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

            {/* Popular Events Section */}
            <section className="popular-events">
                <h2>Upcoming Events</h2>
                <div className="event-cards">
                    {/* Event cards can be dynamically generated here */}
                    <div className="event-card event1">
                        <h3>Event 1</h3>
                        <p>Details about Event 1</p>
                    </div>
                    <div className="event-card event2">
                        <h3>Event 2</h3>
                        <p>Details about Event 2</p>
                    </div>
                    <div className="event-card event3">
                        <h3>Event 3</h3>
                        <p>Details about Event 3</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
