import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // State variables for data
  const [events, setEvents] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Retrieve the JWT token from local storage
    const token = localStorage.getItem('token');

    // Check if the token exists
    if (!token) {
      console.error('No token found. Please log in.');
      // Optionally redirect to login page
      // window.location.href = '/login';
      return;
    }

    // Set up headers with the token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch events (no token needed as per your security config)
    axios.get('http://localhost:8080/events')
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));

    // Fetch event registrations (token required)
    axios.get('http://localhost:8080/api/eventregistrations', config)
      .then(response => setEventRegistrations(response.data))
      .catch(error => {
        console.error('Error fetching event registrations:', error);
        if (error.response && error.response.status === 403) {
          // Handle unauthorized access
          console.error('Access denied. Please ensure you are logged in.');
        }
      });

    // Fetch users (token required)
    axios.get('http://localhost:8080/api/users', config)
      .then(response => setUsers(response.data))
      .catch(error => {
        console.error('Error fetching users:', error);
        if (error.response && error.response.status === 403) {
          // Handle unauthorized access
          console.error('Access denied. Please ensure you are logged in.');
        }
      });
  }, []);

  // Debugging logs
  useEffect(() => {
    console.log('eventRegistrations:', eventRegistrations);
  }, [eventRegistrations]);

  useEffect(() => {
    console.log('users:', users);
  }, [users]);

  useEffect(() => {
    console.log('events:', events);
  }, [events]);

  // Prepare data for the Pie Chart - Registrations per Event
  const registrationsPerEvent = useMemo(() => {
    if (!events.length || !eventRegistrations.length) return [];

    return events.map(event => {
      const count = eventRegistrations.filter(reg => reg.event.eventID === event.eventID).length;
      return { name: event.eventName, value: count };
    });
  }, [events, eventRegistrations]);

  // Prepare data for the Bar Chart - Registrations Over Time
  const registrationsByMonth = useMemo(() => {
    if (!eventRegistrations.length) return [];

    const monthCounts = {};

    eventRegistrations.forEach(registration => {
      if (registration && registration.registrationDate) {
        const dateParts = registration.registrationDate.split('-');
        if (dateParts.length === 3) {
          const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
          const month = dateObj.toLocaleString('default', { month: 'short' });

          monthCounts[month] = (monthCounts[month] || 0) + 1;
        } else {
          console.warn('Invalid registrationDate format:', registration.registrationDate);
        }
      } else {
        console.warn('Missing registrationDate in registration:', registration);
      }
    });

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthOrder
      .filter(month => monthCounts[month])
      .map(month => ({ month, registrations: monthCounts[month] }));
  }, [eventRegistrations]);

  // Define colors for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#9966FF', '#FF9F40'];

  // Handle loading state
  if (!events.length || !eventRegistrations.length || !users.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard-content">
      <h2 className="dashboard-title">Admin Dashboard Analytics</h2>
      <div className="analytics-container">
        {/* Total Users */}
        <div className="analytics-card">
          <h3 className="card-title">Total Users</h3>
          <p className="card-value">{users.length}</p>
        </div>

        {/* Total Events */}
        <div className="analytics-card">
          <h3 className="card-title">Total Events</h3>
          <p className="card-value">{events.length}</p>
        </div>

        {/* Total Event Registrations */}
        <div className="analytics-card">
          <h3 className="card-title">Total Event Registrations</h3>
          <p className="card-value">{eventRegistrations.length}</p>
        </div>

        {/* Pie Chart - Registrations per Event */}
        {registrationsPerEvent.length > 0 ? (
          <div className="analytics-card">
            <h3 className="card-title">Registrations per Event</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={registrationsPerEvent}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {registrationsPerEvent.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        ) : (
          <div>No registration data available for pie chart.</div>
        )}

        {/* Bar Chart - Event Registrations Over Time */}
        {registrationsByMonth.length > 0 ? (
          <div className="analytics-card">
            <h3 className="card-title">Event Registrations Over Time</h3>
            <BarChart width={500} height={300} data={registrationsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="registrations" fill="#8884d8" name="Registrations" />
            </BarChart>
          </div>
        ) : (
          <div>No registration data available for bar chart.</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
