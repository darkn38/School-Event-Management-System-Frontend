import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        console.log('Role from localStorage:', role);  // Add this for debugging
        setUserRole(role);
    }, []);

    const goToAdmin = () => {
        navigate('/admin');
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-text">
                    <h1>MADE FOR THOSE WHO DO</h1>
                    <p>Discover exciting events and manage your own.</p>
                    {userRole === 'Admin' && (
                        <button onClick={goToAdmin}>Go to Admin Page</button>
                    )}
                </div>
            </section>

            {/* Filter Bar Below Hero Section */}
            <section className="filter-bar">
                <div className="filter-option">
                    <label>Looking for</label>
                    <select>
                        <option>Choose event type</option>
                        {/* Additional options as needed */}
                    </select>
                </div>
                <div className="filter-option">
                    <label>Location</label>
                    <select>
                        <option>Choose location</option>
                        {/* Additional options as needed */}
                    </select>
                </div>
                <div className="filter-option">
                    <label>When</label>
                    <select>
                        <option>Choose date and time</option>
                        {/* Additional options as needed */}
                    </select>
                </div>
                <button className="search-button">Search</button>
            </section>

            {/* Popular Events Section */}
            <section className="popular-events">
                <h2>Upcoming Events</h2>
                <div className="event-cards">
                    {/* Event cards can be dynamically generated here */}
                    <div className="event-card event1">
                        <p>Event 1</p>
                    </div>
                    <div className="event-card event2">
                        <p>Event 2</p>
                    </div>
                    <div className="event-card event3">
                        <p>Event 3</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
