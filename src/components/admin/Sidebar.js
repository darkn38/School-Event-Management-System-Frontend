import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import './Sidebar.css'; // Ensure the CSS is being imported correctly

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    { title: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { title: 'Events', icon: <EventIcon />, path: '/admin/events' },
    { title: 'Reminders', icon: <NotificationsIcon />, path: '/admin/reminders' },
    { title: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <List className="sidebar-list">
        {navigationItems.map((item) => (
          <ListItem
            button
            key={item.title}
            component={Link}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );
};

export default Sidebar;
