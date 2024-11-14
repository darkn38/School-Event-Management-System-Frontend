// ProfilePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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
    <div className="profile-container">
      <Typography variant="h4" className="profile-title">
        Edit Profile
      </Typography>
      <Grid container spacing={3} className="profile-grid">
        <Grid item xs={12} md={6} className="profile-details-section">
          <Typography variant="h6" className="section-title">Current Details</Typography>
          <Typography className="detail-item"><strong>First Name:</strong> {user.firstName}</Typography>
          <Typography className="detail-item"><strong>Last Name:</strong> {user.lastName}</Typography>
          <Typography className="detail-item"><strong>Email:</strong> {user.emailAddress}</Typography>
        </Grid>

        <Grid item xs={12} md={6} className="profile-edit-section">
          <Typography variant="h6" className="section-title">Edit Details</Typography>
          <TextField
            label="First Name"
            name="firstName"
            value={user.firstName}
            variant="outlined"
            fullWidth
            onChange={handleChange}
            disabled={!isEditing}
            className="text-field"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={user.lastName}
            variant="outlined"
            fullWidth
            onChange={handleChange}
            disabled={!isEditing}
            className="text-field"
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
            className="text-field"
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
            className="text-field"
          />

          <div className="button-container">
            {isEditing ? (
              <>
                <Button variant="contained" onClick={handleCancel} className="cancel-button">
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSave} className="save-button">
                  Save
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleEdit} className="edit-button">
                Edit Profile
              </Button>
            )}
          </div>
        </Grid>
      </Grid>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Are you sure you want to discard them?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Keep Editing
          </Button>
          <Button onClick={handleConfirmDiscardChanges} color="secondary" autoFocus>
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
