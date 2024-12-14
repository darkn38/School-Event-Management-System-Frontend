import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                {/* About Section */}
                <div className="footer-column">
                    <h4>About</h4>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/policies">Policies</Link></li>
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                        <li><Link to="/privacy">Privacy</Link></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div className="footer-column">
                    <h4>Follow</h4>
                    <ul>
                        <li><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
                        <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
                        <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
                        <li><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} School Event Management System. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
