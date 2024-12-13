import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import './AdminUsers.css';

// Styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: '8px 12px', // Reduced padding for compactness
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '8px 12px', // Reduced padding for compactness
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const User = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ firstName: '', lastName: '', emailAddress: '', role: '', password: '' });
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [confirmationDialog, setConfirmationDialog] = useState(false); // Confirmation dialog for update

  const apiUrl = 'http://localhost:8080/api/users';

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editMode) {
        await axios.put(`${apiUrl}/${currentUserId}`, user, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setConfirmationDialog(true); // Show confirmation dialog after update
      } else {
        await axios.post(apiUrl, user, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setUser({ firstName: '', lastName: '', emailAddress: '', role: '', password: '' });
      setEditMode(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setUser({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      role: user.role,
      password: '', // Optionally keep password empty on edit
    });
    setEditMode(true);
    setCurrentUserId(user.userID);
  };

  // Open delete confirmation dialog
  const confirmDeleteUser = (id) => {
    setUserToDelete(id);
    setOpenDialog(true);
  };

  // Delete user after confirmation
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      setOpenDialog(false);
    }
  };

  // Close delete dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Close confirmation dialog
  const handleCloseConfirmationDialog = () => {
    setConfirmationDialog(false);
  };

  return (
    <div className="user-container" style={{ marginLeft: '250px' }}>
      <h2>User Management</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="text"
          placeholder="First Name"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={user.emailAddress}
          onChange={(e) => setUser({ ...user, emailAddress: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required={!editMode}
        />
        <button type="submit" className="submit-button">
          {editMode ? 'Update User' : 'Add User'}
        </button>
      </form>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>First Name</StyledTableCell>
              <StyledTableCell>Last Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <StyledTableRow key={user.userID}>
                <StyledTableCell component="th" scope="row">
                  {user.firstName}
                </StyledTableCell>
                <StyledTableCell>{user.lastName}</StyledTableCell>
                <StyledTableCell>{user.emailAddress}</StyledTableCell>
                <StyledTableCell>{user.role}</StyledTableCell>
                <StyledTableCell>
                  <button onClick={() => handleEdit(user)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => confirmDeleteUser(user.userID)} className="delete-button">
                    Delete
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm User Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} className="cancel-button">
            Cancel
          </Button>
          <Button onClick={handleDelete} className="delete-button" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Confirmation Dialog */}
      <Dialog
        open={confirmationDialog}
        onClose={handleCloseConfirmationDialog}
        aria-labelledby="update-dialog-title"
        aria-describedby="update-dialog-description"
      >
        <DialogTitle id="update-dialog-title">{"User Updated"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="update-dialog-description">
            The user details have been updated successfully!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default User;
