import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected the import
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

                // Decode the token to get user information
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);

                // Extract user information from the token
                const userEmail = decodedToken.sub; // Email
                const userID = decodedToken.userID; // Assuming 'userID' is a claim in the token

                // Store the token and extracted information in localStorage
                localStorage.setItem('token', token);
                if (userEmail) {
                    localStorage.setItem('userEmail', userEmail);
                } else {
                    console.error("Email not found in the decoded token.");
                }
                if (userID) {
                    localStorage.setItem('userID', userID);
                } else {
                    console.error("User ID not found in the decoded token.");
                }

                // Store the role and isAdmin in localStorage
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userRole', role);
                localStorage.setItem('isAdmin', isAdmin);

                // Update the application state with the role
                setLoggedIn(role);

                // Redirect based on the user role
                if (role === 'Admin') {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }

                // Show success dialog
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
                    <h2>Login</h2>
                    {message && dialogType === 'error' && <p style={{ color: 'red' }}>{message}</p>}
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    <div className="register-link">
                        <button onClick={() => navigate('/register')} className="register-button">
                            Register
                        </button>
                    </div>
                </div>

                <div className="login-right">
                    {/* You can add any extra content here, like a logo or a background */}
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
