import React, { useState } from 'react';
import axios from 'axios';
import './ContactPage.css';

const ContactUsPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [fromEmail, setFromEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            firstName,
            lastName,
            fromEmail,
            phone,
            subject,
            message
        };

        try {
            // Assume your backend endpoint to send emails is:
            // POST http://localhost:8080/api/contact
            // Backend should handle sending email to: schooleventms@gmail.com
            await axios.post('http://localhost:8080/api/contact', payload);
            setStatusMessage('Your message has been sent successfully!');
            // Clear the form
            setFirstName('');
            setLastName('');
            setFromEmail('');
            setPhone('');
            setSubject('');
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setStatusMessage('Failed to send your message. Please try again later.');
        }
    };

    return (
        <div className="contact-us-page">
            {/* Hero Section */}
            <section className="contact-hero-section">
                <div className="contact-hero-text">
                    <h1>Get in Touch</h1>
                    <p>We’re here to help. Fill out the form below to reach out to our team.</p>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="contact-hero">
                <div className="contact-info">
                    <h2>Let's talk with us</h2>
                    <p>Questions, comments, or suggestions? Fill in the form, and we'll be in touch shortly.</p>
                    <div className="contact-details">
                        <p><i className="fa fa-map-marker-alt"></i> 1055 Arthur ave Elk Groot, 67.<br/>New Palmas South Carolina.</p>
                        <p><i className="fa fa-phone"></i> +1 234 678 9108 99</p>
                        <p><i className="fa fa-envelope"></i> schooleventms@gmail.com</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="contact-form">
                    <h1>Contact Us</h1>
                    {statusMessage && <div className="status-message">{statusMessage}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="First Name*"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name*"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="Your Email*"
                            value={fromEmail}
                            onChange={(e) => setFromEmail(e.target.value)}
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Subject*"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ContactUsPage;
