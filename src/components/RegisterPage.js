import React, { useState } from 'react';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Button, TextField, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './RegisterPage.css';

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student'); // Default to student
  const [message, setMessage] = useState(''); // Unified state for messages
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility
  const [dialogType, setDialogType] = useState('success'); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      firstName,
      lastName,
      emailAddress: email,
      password,
      role,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/users/register', user);
      console.log('Registration Response:', response);

      if (response.status === 201) {
        setMessage('Registration successful!');
        setDialogType('success');
      } else {
        setMessage('Registration failed. Please try again.');
        setDialogType('error');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setMessage('Email already exist please change your email.');
      setDialogType('error');
    } finally {
      setOpenDialog(true); // Show the dialog with the message
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
  };

  const handleBack = () => {
    window.history.back(); // Go back to the previous page (LoginPage)
  };

  return (
    <div className="register-page">
      <Box className="register-container">
        <Typography variant="h4" component="h1" align="center" className="register-title">
          Register
        </Typography>
        <form onSubmit={handleSubmit} className="register-form">
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Role Dropdown */}
          <FormControl fullWidth required margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="register-submit-button"
          >
            Register
          </Button>
          {/* Back Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleBack} // Trigger back functionality
            className="back-button"
          >
            Back to Login
          </Button>
        </form>
      </Box>

      {/* Dialog for success or error messages */}
      <Dialog fullWidth open={openDialog} onClose={handleCloseDialog}>
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
}

export default RegisterPage;
