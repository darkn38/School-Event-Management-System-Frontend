import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import './LoginPage.css';

const LoginPage = ({ setLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('success');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const user = { emailAddress: email, password: password };

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', user);
            if (response.status === 200) {
                const { token, role, isAdmin } = response.data;
                const decodedToken = jwtDecode(token);
                const userEmail = decodedToken.sub; 
                const userID = decodedToken.userID; 

                localStorage.setItem('token', token);
                if (userEmail) localStorage.setItem('userEmail', userEmail);
                if (userID) localStorage.setItem('userID', userID);

                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userRole', role);
                localStorage.setItem('isAdmin', isAdmin);

                setLoggedIn(role);
                navigate(role === 'Admin' ? '/admin' : '/home');

                setMessage('Login successful!');
                setDialogType('success');
                setOpenDialog(true);
            }
        } catch (error) {
            setMessage('Invalid email or password');
            setDialogType('error');
            setOpenDialog(true);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-left">
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">Sign in to manage or request events</p>
                    
                    {message && dialogType === 'error' && (
                        <p className="error-message">{message}</p>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    
                    <div className="register-link">
                        <p>Don't have an account?</p>
                        <button onClick={() => navigate('/register')} className="register-button">
                            Register
                        </button>
                    </div>
                </div>

                <div className="login-right">
                    <div className="login-right-overlay">
                        <h3 className="right-overlay-text">
                            "Empowering Students &amp; Faculty to Curate Memorable Events"
                        </h3>
                    </div>
                </div>
            </div>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    <div className="dialog-title">
                        <span className={`dialog-icon ${dialogType}`}>
                            {dialogType === 'success' ? <CheckCircleIcon /> : <ErrorIcon />}
                        </span>
                        {dialogType === 'success' ? 'Success!' : 'Error!'}
                    </div>
                </DialogTitle>
                <DialogContent>
                    <Typography>{message}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LoginPage;
