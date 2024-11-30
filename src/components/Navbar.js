import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './Navbar.css';
import profileIcon from '../images/user.png';

const Navbar = ({ logout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = () => {
            const role = localStorage.getItem('userRole');
            setUserRole(role);
        };

        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/eventregistrations/notifications/upcoming', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch notifications');
                }

                const data = await response.json();

                // Filter unique upcoming events if duplicates are received
                const uniqueNotifications = data.filter(
                    (notif, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.eventName === notif.eventName &&
                                t.eventDate === notif.eventDate &&
                                t.eventTime === notif.eventTime
                        )
                );

                setNotifications(uniqueNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                alert('Error fetching notifications. Please try again later.');
            }
        };

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };

        fetchUserRole();
        fetchNotifications();

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        localStorage.clear(); // Clear all local storage for simplicity
        navigate('/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const toggleNotificationDropdown = () => {
        setIsNotificationOpen((prev) => !prev);
    };

    const handleMyAccount = () => {
        navigate('/profile');
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                {/* Logo Section */}
                <div className="logo">
                    <Link to="/home">
                        <img src={require('../images/logo.png')} alt="Logo" className="logo-img" />
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="nav-links">
                    <Link to="/home">Home</Link>
                    <Link to="/registrations">Registrations</Link>
                    <Link to="/events">Events</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/create">Create</Link>
                    <Link to="/contact">Contact Us</Link>
                    {userRole === 'Admin' && <Link to="/admin">Admin</Link>}
                </div>

                {/* Notifications */}
                <div className="notification-section" ref={notificationRef}>
                    <div className="notification-icon-container" onClick={toggleNotificationDropdown}>
                        <NotificationsIcon className="notification-icon" />
                        {notifications.length > 0 && <span className="red-dot"></span>}
                    </div>
                    {isNotificationOpen && (
                        <div className="notification-dropdown">
                            {notifications.length > 0 ? (
                                notifications.map((notif, index) => (
                                    <div key={index} className="notification-item">
                                        <strong>{notif.eventName || 'Unknown Event'}</strong>
                                        <br />
                                        Date: {notif.eventDate ? new Date(notif.eventDate).toLocaleDateString() : 'Unknown Date'}
                                        <br />
                                        Time: {notif.eventTime || 'Unknown Time'}
                                        <br />
                                        Location: {notif.location || 'Unknown Location'}
                                    </div>
                                ))
                            ) : (
                                <div className="notification-item">No events nearing</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile Section */}
                <div className="profile-section" ref={dropdownRef}>
                    <img
                        src={profileIcon}
                        alt="Profile"
                        className="profile-icon"
                        onClick={toggleDropdown}
                    />
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <button onClick={handleMyAccount} className="dropdown-item">
                                <AccountCircleIcon style={{ marginRight: '8px' }} />
                                My Account
                            </button>
                            <button onClick={handleLogout} className="dropdown-item">
                                <LogoutIcon style={{ marginRight: '8px' }} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
