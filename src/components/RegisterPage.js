import React, { useState } from 'react';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Button,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import './RegisterPage.css';

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('success');

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
      if (response.status === 201) {
        setMessage('Registration successful!');
        setDialogType('success');
      } else {
        setMessage('Registration failed. Please try again.');
        setDialogType('error');
      }
    } catch (error) {
      setMessage('Email already exists. Please change your email.');
      setDialogType('error');
    } finally {
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="register-page">
      <Box className="register-container">
        <Typography variant="h4" component="h1" align="center" className="register-title">
          Create Your Account
        </Typography>
        <Typography variant="body1" align="center" className="register-subtitle">
          Join us and start managing or requesting events easily
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
          <Button type="submit" variant="contained" fullWidth className="register-submit-button">
            Register
          </Button>
          <Button variant="contained" fullWidth onClick={handleBack} className="back-button">
            Back to Login
          </Button>
        </form>
      </Box>
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
