import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EventsPage.css'; // Link to the EventsPage CSS file

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Fetch events from the backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Retrieve token from local storage
                const token = localStorage.getItem('token');

                if (!token) {
                    console.error('No token found');
                    return; // Optionally redirect the user to the login page
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
    };

    // Handle user registration
    const handleRegistration = (e) => {
        e.preventDefault();
        if (selectedEvent && userInfo.name && userInfo.email) {
            alert(`Registration for ${selectedEvent.event_name} is successful!`);
        } else {
            alert("Please fill in all details.");
        }
    };

    // Simulate a successful payment
    const handlePayment = () => {
        if (selectedEvent) {
            setPaymentSuccess(true);
            alert(`Payment for ${selectedEvent.event_name} was successful!`);
        } else {
            alert("Select an event to pay for.");
        }
    };

    return (
        <div className="events-page">
            <section className="events-header">
                <h1>Upcoming Events</h1>
            </section>

            <div className="events-content">
                {/* Left side - Events list */}
                <section className="events-list">
                    {events.map((event) => (
                        <div className="event-card" key={event.event_id} onClick={() => handleEventSelect(event)}>
                            <h2>{event.event_name}</h2>
                            <p><strong>Date:</strong> {event.date}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <p>{event.description}</p>
                        </div>
                    ))}
                </section>

                {/* Right side - Registration & Payment */}
                {selectedEvent && !paymentSuccess && (
                    <section className="payment-section">
                        <h2>Register for {selectedEvent.event_name}</h2>
                        <form onSubmit={handleRegistration}>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={userInfo.name}
                                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                value={userInfo.email}
                                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                required
                            />
                            <button type="submit">Register</button>
                        </form>

                        <button className="payment-button" onClick={handlePayment}>Make Payment</button>
                    </section>
                )}

                {paymentSuccess && (
                    <section className="payment-success">
                        <h2>Your registration for {selectedEvent.event_name} is complete!</h2>
                        <p>We look forward to seeing you at the event.</p>
                    </section>
                )}
            </div>
        </div>
    );
};

export default EventsPage;
