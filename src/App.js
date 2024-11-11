import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import EventsPage from './components/EventsPage';
import AboutPage from './components/AboutPage';
import CreatePage from './components/CreatePage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminEvents from './components/admin/AdminEvents';
import AdminReminders from './components/admin/AdminReminders';
import AdminUsers from './components/admin/AdminUsers';
import Sidebar from './components/admin/Sidebar';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

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
            path="/admin/reminders" 
            element={
                <>
                    <Navbar logout={handleLogout} userRole={userRole} />
                    <div className="admin-container">
                        <Sidebar />  {/* Sidebar on the left */}
                        <AdminReminders />  {/* Main content */}
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
                            </>
                        )}
                    </>
                )}

                {/* Default Route */}
                <Route 
                    path="/" 
                    element={loggedIn ? <Navigate to={userRole === 'Admin' ? '/admin' : '/home'} /> : <Navigate to="/login" />} 
                />
            </Routes>
        </Router>
    );
};

export default App;
