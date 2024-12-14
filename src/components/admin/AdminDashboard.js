import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // Fetch events
    axios
      .get('http://localhost:8080/events')
      .then((response) => setEvents(response.data))
      .catch((error) => console.error('Error fetching events:', error));

    // Fetch event registrations
    axios
      .get('http://localhost:8080/api/eventregistrations', config)
      .then((response) => setEventRegistrations(response.data))
      .catch((error) => {
        console.error('Error fetching event registrations:', error);
        if (error.response && error.response.status === 403) {
          console.error('Access denied. Please ensure you are logged in.');
        }
      });

    // Fetch users
    axios
      .get('http://localhost:8080/api/users', config)
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error('Error fetching users:', error);
        if (error.response && error.response.status === 403) {
          console.error('Access denied. Please ensure you are logged in.');
        }
      });
  }, []);

  // Compute registrations per event (for Pie Chart)
  const registrationsPerEvent = useMemo(() => {
    if (!events.length || !eventRegistrations.length) return [];

    return events.map((event) => {
      const count = eventRegistrations.filter(
        (reg) => reg.eventId === event.eventID
      ).length;
      return { name: event.eventName || 'Unknown Event', value: count };
    });
  }, [events, eventRegistrations]);

  // Compute registrations by month for Bar Chart
  const registrationsByMonth = useMemo(() => {
    if (!eventRegistrations.length) return [];
    return aggregateByMonth(eventRegistrations, 'registrationDate', 'registrations');
  }, [eventRegistrations]);

  // Compute user registrations by month for Line Chart
  const usersByMonth = useMemo(() => {
    if (!users.length) return [];
    return aggregateByMonth(users, 'registrationDate', 'users');
  }, [users]);

  // Aggregate data by month helper function
  function aggregateByMonth(dataArray, dateField, valueKey) {
    const monthCounts = {};
    dataArray.forEach((item) => {
      if (item?.[dateField]) {
        const dateParts = item[dateField].split('-');
        if (dateParts.length === 3) {
          const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
          const month = dateObj.toLocaleString('default', { month: 'short' });
          monthCounts[month] = (monthCounts[month] || 0) + 1;
        }
      }
    });

    const monthOrder = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return monthOrder
      .filter((month) => monthCounts[month])
      .map((month) => ({ month, [valueKey]: monthCounts[month] }));
  }

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#FF6384',
    '#36A2EB',
    '#9966FF',
    '#FF9F40',
  ];

  if (!events.length || !eventRegistrations.length || !users.length) {
    return (
      <div className="admin-dashboard-content loading-state">
        <h2 className="dashboard-title">Loading data...</h2>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-content">
      <h2 className="dashboard-title">Admin Dashboard Analytics</h2>
      <div className="analytics-container">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="analytics-card">
            <h3 className="card-title">Total Users</h3>
            <p className="card-value">{users.length}</p>
          </div>
          <div className="analytics-card">
            <h3 className="card-title">Total Events</h3>
            <p className="card-value">{events.length}</p>
          </div>
          <div className="analytics-card">
            <h3 className="card-title">Total Registrations</h3>
            <p className="card-value">{eventRegistrations.length}</p>
          </div>
        </div>

        <div className="charts-row">
          {/* Pie Chart - Registrations per Event */}
          <div className="chart-card">
            <h3 className="chart-title">Registrations per Event</h3>
            {registrationsPerEvent.length > 0 ? (
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
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <p>No registration data available.</p>
            )}
          </div>

          {/* Bar Chart - Event Registrations Over Time */}
          <div className="chart-card">
            <h3 className="chart-title">Event Registrations Over Time</h3>
            {registrationsByMonth.length > 0 ? (
              <BarChart width={500} height={300} data={registrationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="registrations" fill="#8884d8" name="Registrations" />
              </BarChart>
            ) : (
              <p>No registration data available.</p>
            )}
          </div>
        </div>

        <div className="charts-row">
          {/* Line Chart - User Registrations Over Time */}
          <div className="chart-card">
            <h3 className="chart-title">User Registrations Over Time</h3>
            {usersByMonth.length > 0 ? (
              <LineChart width={500} height={300} data={usersByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Users" />
              </LineChart>
            ) : (
              <p>No user data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
