import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const apiUrl = 'http://localhost:8080/api/users/profile';

  // Fetch current user profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        emailAddress: response.data.emailAddress,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setErrorMessage('Failed to fetch user details. Please try again.');
      setErrorDialog(true);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Save user profile changes
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(apiUrl, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConfirmationDialog(true); // Show confirmation dialog
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMsg =
        error.response?.data?.message || 'Failed to update profile. Please try again.';
      setErrorMessage(errorMsg);
      setErrorDialog(true);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    fetchUserProfile(); // Reset user data to original
  };

  // Handle error dialog close
  const handleCloseErrorDialog = () => {
    setErrorDialog(false);
  };

  // Handle confirmation dialog close
  const handleCloseConfirmationDialog = () => {
    setConfirmationDialog(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '40px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          My Profile
        </Typography>

        <Grid container spacing={4}>
          {/* Current Details Section */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: '#f4f4f4',
                padding: '16px',
                borderRadius: '8px',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Current Details
              </Typography>
              <Typography>
                <strong>First Name:</strong> {user.firstName}
              </Typography>
              <Typography>
                <strong>Last Name:</strong> {user.lastName}
              </Typography>
              <Typography>
                <strong>Email:</strong> {user.emailAddress}
              </Typography>
            </Box>
          </Grid>

          {/* Edit Details Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Edit Details
            </Typography>
            <form noValidate autoComplete="off">
              <TextField
                label="First Name"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={!editMode}
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={!editMode}
              />
              <TextField
                label="Email"
                name="emailAddress"
                value={user.emailAddress}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={!editMode}
              />
            </form>
          </Grid>
        </Grid>

        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}
        >
          {editMode ? (
            <>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Edit Profile
            </Button>
          )}
        </Box>
      </Paper>

      {/* Error Dialog */}
      <Dialog
        open={errorDialog}
        onClose={handleCloseErrorDialog}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">{"Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationDialog}
        onClose={handleCloseConfirmationDialog}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">{"Profile Updated"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            Your profile has been updated successfully!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
