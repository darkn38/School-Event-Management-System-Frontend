import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import UserRegistrations from './components/UserRegistrations';
import EventsPage from './components/EventsPage';
import AboutPage from './components/AboutPage';
import CreatePage from './components/CreatePage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminEvents from './components/admin/AdminEvents';
import AdminRegistrations from './components/admin/AdminRegistrations';
import AdminUsers from './components/admin/AdminUsers';
import Sidebar from './components/admin/Sidebar';
import SearchResultsPage from './components/SearchResultsPage';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const storedLoginState = localStorage.getItem('loggedIn');
        const storedUserRole = localStorage.getItem('userRole');
        if (storedLoginState === 'true' && storedUserRole) {
            setLoggedIn(true);
            setUserRole(storedUserRole);
        }
    }, []);

    const handleLogin = (role) => {
        setLoggedIn(true);
        setUserRole(role);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userRole', role);
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUserRole(null);
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userRole');
    };

    const addNotification = (notification) => {
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
    };

    // Custom component that includes location and conditional footer
    const Layout = () => {
        const location = useLocation();

        // Footer should appear only on these routes
        const showFooter = ["/home", "/contact", "/about"].includes(location.pathname);

        return (
            <>
                <Routes>
                    <Route 
                        path="/login" 
                        element={
                            loggedIn 
                            ? <Navigate to={userRole === 'Admin' ? '/admin' : '/home'} /> 
                            : <LoginPage setLoggedIn={handleLogin} />
                        } 
                    />
                    <Route path="/register" element={<RegisterPage />} />

                    {loggedIn && (
                        <>
                            {userRole !== 'Admin' && (
                                <>
                                    <Route path="/home" element={<><Navbar logout={handleLogout} userRole={userRole} /><HomePage userRole={userRole}/></>} />
                                    <Route path="/registrations" element={<><Navbar logout={handleLogout} userRole={userRole}/><UserRegistrations/></>} />
                                    <Route path="/events" element={<><Navbar logout={handleLogout} userRole={userRole}/><EventsPage/></>} />
                                    <Route path="/about" element={<><Navbar logout={handleLogout} userRole={userRole}/><AboutPage/></>} />
                                    <Route path="/create" element={<><Navbar logout={handleLogout} userRole={userRole}/><CreatePage/></>} />
                                    <Route path="/contact" element={<><Navbar logout={handleLogout} userRole={userRole}/><ContactPage/></>} />
                                    <Route path="/profile" element={<><Navbar logout={handleLogout} userRole={userRole}/><ProfilePage/></>} />
                                    <Route path="/search-results" element={<><Navbar logout={handleLogout} userRole={userRole}/><SearchResultsPage/></>} />
                                </>
                            )}

                            {userRole === 'Admin' && (
                                <>
                                    <Route path="/admin" element={<><Navbar logout={handleLogout} userRole={userRole}/><div className="admin-container"><Sidebar/><AdminDashboard/></div></>} />
                                    <Route path="/admin/events" element={<><Navbar logout={handleLogout} userRole={userRole}/><div className="admin-container"><Sidebar/><AdminEvents/></div></>} />
                                    <Route path="/admin/registrations" element={<><Navbar logout={handleLogout} userRole={userRole} notifications={notifications}/><div className="admin-container"><Sidebar/><AdminRegistrations addNotification={addNotification}/></div></>} />
                                    <Route path="/admin/users" element={<><Navbar logout={handleLogout} userRole={userRole}/><div className="admin-container"><Sidebar/><AdminUsers/></div></>} />

                                    {/* Admin can also access standard pages */}
                                    <Route path="/home" element={<><Navbar logout={handleLogout} userRole={userRole}/><HomePage userRole={userRole}/></>} />
                                    <Route path="/registrations" element={<><Navbar logout={handleLogout} userRole={userRole}/><UserRegistrations/></>} />
                                    <Route path="/events" element={<><Navbar logout={handleLogout} userRole={userRole}/><EventsPage/></>} />
                                    <Route path="/about" element={<><Navbar logout={handleLogout} userRole={userRole}/><AboutPage/></>} />
                                    <Route path="/create" element={<><Navbar logout={handleLogout} userRole={userRole}/><CreatePage/></>} />
                                    <Route path="/contact" element={<><Navbar logout={handleLogout} userRole={userRole}/><ContactPage/></>} />
                                    <Route path="/profile" element={<><Navbar logout={handleLogout} userRole={userRole}/><ProfilePage/></>} />
                                    <Route path="/search-results" element={<><Navbar logout={handleLogout} userRole={userRole}/><SearchResultsPage/></>} />
                                </>
                            )}
                        </>
                    )}

                    <Route path="/" element={loggedIn ? <Navigate to={userRole === 'Admin' ? '/admin' : '/home'} /> : <Navigate to="/login" />} />
                    <Route path="*" element={<div>Route not found</div>} />
                </Routes>

                {showFooter && <Footer />}
            </>
        );
    };

    return (
        <Router>
            <Layout />
        </Router>
    );
};

export default App;
