import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import './Navbar.css';
import profileIcon from '../images/user.png';

const Navbar = ({ logout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false); // Close dropdown if clicking outside of it
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAdmin');
        localStorage.setItem('loggedIn', 'false');
        setIsDropdownOpen(false); // Close dropdown on logout
        navigate('/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleMyAccount = () => {
        setIsDropdownOpen(false); // Close dropdown when navigating to the profile page
        navigate('/profile');
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo">
                    <img src={require('../images/logo.png')} alt="Logo" className="logo-img" />
                </div>
                <div className="nav-links">
                    <Link to="/home">Home</Link>
                    <Link to="/events">Events</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/create">Create</Link>
                    <Link to="/contact">Contact Us</Link>
                    {userRole === 'Admin' && (
                        <Link to="/admin">Admin</Link>
                    )}
                </div>
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
