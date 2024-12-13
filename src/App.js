import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
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
const resizeObserverErrorHandler = e => {
    if (e.message && e.message.startsWith('ResizeObserver loop')) {
      // Ignore ResizeObserver loop limit exceeded error
      return;
    }
    console.error(e);
  };
  
  window.addEventListener('error', resizeObserverErrorHandler);
  

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [notifications, setNotifications] = useState([]); // Shared notification state

    useEffect(() => {
        // Check if the user is logged in by reading from localStorage
        const storedLoginState = localStorage.getItem('loggedIn');
        const storedUserRole = localStorage.getItem('userRole');
        if (storedLoginState === 'true' && storedUserRole) {
            setLoggedIn(true);
            setUserRole(storedUserRole);
        }
    }, []);

    const handleLogin = (role) => {
        // On successful login, store the login state and role in localStorage
        setLoggedIn(true);
        setUserRole(role);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userRole', role);  // Store the actual role (e.g., "Admin")
    };

    const handleLogout = () => {
        // Clear user login state from localStorage and state
        setLoggedIn(false);
        setUserRole(null);
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userRole');
    };

    // Add a notification to the state
    const addNotification = (notification) => {
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
    };

    return (
        <Router>
            <Routes>
                {/* Login Route */}
                <Route 
                    path="/login" 
                    element={loggedIn ? <Navigate to={userRole === 'Admin' ? '/admin' : '/home'} /> : <LoginPage setLoggedIn={handleLogin} />} 
                />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes with Navbar */}
                {loggedIn && (
                    <>
                        {/* Standard User Routes */}
                        {userRole !== 'Admin' && (
                            <>
                                <Route 
                                    path="/home" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><HomePage userRole={userRole} /></>} 
                                />
                                <Route 
                                    path="/registrations" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><UserRegistrations /></>} 
                                />
                                <Route 
                                    path="/events" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><EventsPage /></>} 
                                />
                                <Route 
                                    path="/about" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><AboutPage /></>} 
                                />
                                <Route 
                                    path="/create" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><CreatePage /></>} 
                                />
                                <Route 
                                    path="/contact" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><ContactPage /></>} 
                                />
                                <Route 
                                    path="/profile" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><ProfilePage /></>} 
                                />
                                <Route 
                                    path="/search-results" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><SearchResultsPage /></>} 
                                />
                            </>
                        )}

                        {/* Admin-Specific Routes */}
                        {userRole === 'Admin' && (
                            <>
                                {/* Admin Route with Sidebar */}
        <Route 
            path="/admin" 
            element={
                <>
                    <Navbar logout={handleLogout} userRole={userRole} />
                    <div className="admin-container">
                        <Sidebar />  {/* Sidebar on the left */}
                        <AdminDashboard />  {/* Main content */}
                    </div>
                </>
            } 
        />

        {/* Admin Events Route */}
        <Route 
            path="/admin/events" 
            element={
                <>
                    <Navbar logout={handleLogout} userRole={userRole} />
                    <div className="admin-container">
                        <Sidebar />  {/* Sidebar on the left */}
                        <AdminEvents />  {/* Main content */}
                    </div>
                </>
            } 
        />

        {/* Admin Reminders Route */}
        <Route 
            path="/admin/registrations" 
            element={
                <>
                        <Navbar logout={handleLogout} userRole={userRole} notifications={notifications} />
                        <div className="admin-container">
                        <Sidebar />  {/* Sidebar on the left */}
                        <AdminRegistrations addNotification={addNotification} />
                    </div>
                </>
            } 
        />

        {/* Admin Users Route */}
        <Route 
            path="/admin/users" 
            element={
                <>
                    <Navbar logout={handleLogout} userRole={userRole} />
                    <div className="admin-container">
                        <Sidebar />  {/* Sidebar on the left */}
                        <AdminUsers />  {/* Main content */}
                    </div>
                </>
            } 
        />
                                <Route 
                                    path="/home" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><HomePage userRole={userRole} /></>} 
                                />
                                <Route 
                                    path="/registrations" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><UserRegistrations /></>} 
                                />
                                <Route 
                                    path="/events" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><EventsPage /></>} 
                                />
                                <Route 
                                    path="/about" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><AboutPage /></>} 
                                />
                                <Route 
                                    path="/create" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><CreatePage /></>} 
                                />
                                <Route 
                                    path="/contact" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><ContactPage /></>} 
                                />
                                <Route 
                                    path="/profile" 
                                    element={<><Navbar logout={handleLogout} userRole={userRole} /><ProfilePage /></>} 
                                />
                                <Route path="/search-results" element={<><Navbar /><SearchResultsPage /></>} />
                            </>
                        )}
                    </>
                )}

                {/* Default Route */}
                <Route 
                    path="/" 
                    element={loggedIn ? <Navigate to={userRole === 'Admin' ? '/admin' : '/home'} /> : <Navigate to="/login" />} 
                />
                <Route path="*" element={<div>Route not found</div>} />
            </Routes>
        </Router>
    );
};

export default App;
