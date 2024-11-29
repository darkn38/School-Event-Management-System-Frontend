import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Box,
  Container,
} from '@mui/material';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:8080/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
        });
    }
  }, []);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword = (password) => password.length >= 8;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setUnsavedChanges(true);

    if (name === 'emailAddress') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: isValidEmail(value) ? '' : 'Invalid email format',
      }));
    }

    if (name === 'password') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: isStrongPassword(value) ? '' : 'Password must be at least 8 characters',
      }));
    }
  };

  const handleCancel = () => {
    if (unsavedChanges) {
      setConfirmDialogOpen(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleConfirmDiscardChanges = () => {
    setConfirmDialogOpen(false);
    setIsEditing(false);
    setUnsavedChanges(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (errors.email || errors.password) {
      alert('Please fix validation errors before saving.');
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      axios
        .put(
          'http://localhost:8080/api/users/profile',
          { ...user },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setUser(response.data);
          setIsEditing(false);
          setUnsavedChanges(false);
          alert('Profile saved successfully.');
        })
        .catch((error) => {
          console.error('Error updating user details:', error);
          alert('Failed to save profile. Please try again.');
        });
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '40px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Edit Profile
        </Typography>

        <Grid container spacing={4}>
          {/* Current Details Section */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: '#f4f4f4',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
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
                variant="outlined"
                fullWidth
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={user.lastName}
                variant="outlined"
                fullWidth
                onChange={handleChange}
                disabled={!isEditing}
                margin="normal"
              />
              <TextField
                label="Email"
                name="emailAddress"
                value={user.emailAddress}
                variant="outlined"
                fullWidth
                onChange={handleChange}
                disabled={!isEditing}
                error={Boolean(errors.email)}
                helperText={errors.email}
                margin="normal"
              />
              <TextField
                label="Password"
                name="password"
                value={user.password}
                type="password"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                disabled={!isEditing}
                error={Boolean(errors.password)}
                helperText={errors.password}
                margin="normal"
              />
            </form>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '16px',
              }}
            >
              {isEditing ? (
                <>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Are you sure you want to discard them?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            color="primary"
          >
            Keep Editing
          </Button>
          <Button
            onClick={handleConfirmDiscardChanges}
            color="secondary"
            autoFocus
          >
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
