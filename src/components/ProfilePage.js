import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch the logged-in user from localStorage
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('userDetails'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Save updated user details to localStorage or send to an API
    localStorage.setItem('userDetails', JSON.stringify(user));
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="profile-container">
      <h2>Profile Details</h2>
      <Grid container spacing={2}>
        {/* Current Details Section (non-editable) */}
        <Grid item xs={12} md={6} style={{ padding: '30px', backgroundColor: '#f4f4f4' }}>
          <h3>Current Details</h3>
          <div style={{ marginBottom: '15px' }}>
            <strong>First Name:</strong> {user.firstName}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Last Name:</strong> {user.lastName}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Email:</strong> {user.emailAddress}
          </div>
        </Grid>

        {/* Edit Details Section (editable) */}
        {isEditing && (
          <Grid item xs={12} md={6} style={{ padding: '30px', backgroundColor: '#fff' }}>
            <h3>Edit Details</h3>
            <TextField
              label="First Name"
              name="firstName"
              value={user.firstName}
              variant="outlined"
              fullWidth
              onChange={handleChange}
              style={{ marginBottom: '15px' }}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={user.lastName}
              variant="outlined"
              fullWidth
              onChange={handleChange}
              style={{ marginBottom: '15px' }}
            />
            <TextField
              label="Email"
              name="emailAddress"
              value={user.emailAddress}
              variant="outlined"
              fullWidth
              onChange={handleChange}
              style={{ marginBottom: '15px' }}
            />
            <TextField
              label="Password"
              name="password"
              value={user.password}
              type="password"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              style={{ marginBottom: '15px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Grid>
        )}

        {!isEditing && (
          <Grid item xs={12} md={6}>
            <Button variant="contained" color="secondary" onClick={handleEdit}>
              Edit Profile
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default ProfilePage;
