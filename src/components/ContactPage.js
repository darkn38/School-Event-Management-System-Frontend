import React, { useState } from 'react';
import './ContactPage.css';

const ContactUsPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message Sent!');
    };

    return (
        <div className="contact-us-page">
            {/* Hero Section */}
            <section className="contact-hero-section">
                <div className="contact-hero-text">
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="contact-hero">
                <div className="contact-info">
                    <h2>Let's talk with us</h2>
                    <p>Questions, comments, or suggestions? Simply fill in the form, and we'll be in touch shortly.</p>
                    <div className="contact-details">
                        <p><i className="fa fa-map-marker-alt"></i> 1055 Arthur ave Elk Groot, 67.<br/>New Palmas South Carolina.</p>
                        <p><i className="fa fa-phone"></i> +1 234 678 9108 99</p>
                        <p><i className="fa fa-envelope"></i> Contact@moralizer.com</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="contact-form">
                    <h1>Contact Us</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="First Name*"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Last Name*"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="Email*"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number*"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <textarea
                            placeholder="Your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ContactUsPage;
