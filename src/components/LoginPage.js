import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import './LoginPage.css';

const LoginPage = ({ setLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openDialog, setOpenDialog] = useState(false); // To control dialog visibility
    const [dialogType, setDialogType] = useState('success'); // Dialog type - success or error
    const [message, setMessage] = useState(''); // Message to display in the dialog
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const user = { emailAddress: email, password: password };

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', user);

            if (response.status === 200) {
                const { token, role, isAdmin } = response.data;

                // Store the token in localStorage
                localStorage.setItem('token', token);

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
        setOpenDialog(false); // Close the dialog
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-left">
                    <h2>Login</h2>
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
                    {/* Register Button */}
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

            {/* Dialog for success or error messages */}
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
