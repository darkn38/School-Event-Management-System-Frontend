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

  const apiUrl = 'http://localhost:8080/api/users'; // Ensure this is correct

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiUrl);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${apiUrl}/${currentUserId}`, user);
      } else {
        await axios.post(apiUrl, user);
      }
      setUser({ firstName: '', lastName: '', emailAddress: '', role: '', password: '' });
      setEditMode(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setUser({ 
      firstName: user.firstName, 
      lastName: user.lastName, 
      emailAddress: user.emailAddress, 
      role: user.role,
      password: '' // Optionally keep password empty on edit
    });
    setEditMode(true);
    setCurrentUserId(user.userID);
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
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
                <StyledTableCell component="th" scope="row">{user.firstName}</StyledTableCell>
                <StyledTableCell>{user.lastName}</StyledTableCell>
                <StyledTableCell>{user.emailAddress}</StyledTableCell>
                <StyledTableCell>{user.role}</StyledTableCell>
                <StyledTableCell>
                  <button onClick={() => handleEdit(user)} className="edit-button">Edit</button>
                  <button onClick={() => handleDelete(user.userID)} className="delete-button">Delete</button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default User;
