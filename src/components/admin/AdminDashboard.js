import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard-content">
            <h2 className="dashboard-title">Admin Dashboard Analytics</h2>
            <div className="analytics-container">
                {/* Card for Total Applications */}
                <div className="analytics-card">
                    <h3 className="card-title">Total Applications</h3>
                    <p className="card-value">201</p>
                </div>
                
                {/* Card for Total Events */}
                <div className="analytics-card">
                    <h3 className="card-title">Total Events</h3>
                    <p className="card-value">12</p>
                </div>
                
                {/* Card for Gauge - Total Application Example */}
                <div className="analytics-card">
                    <h3 className="card-title">Total Application</h3>
                    <div className="gauge">
                        <p className="gauge-value">2,358</p>
                    </div>
                </div>
                
                {/* Card for Pie Chart - Application Status Example */}
                <div className="analytics-card">
                    <h3 className="card-title">Application Status</h3>
                    <div className="pie-chart">
                        <p>Item 1</p>
                        <p>Item 2</p>
                        <p>Item 3</p>
                    </div>
                    <ul className="pie-legend">
                        <li>Item 1</li>
                        <li>Item 2</li>
                        <li>Item 3</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
