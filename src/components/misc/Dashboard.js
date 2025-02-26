import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../../styles/Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="welcome-section">
          <h2>Welcome to Reach Demo</h2>
          <p>Create AI-powered user interviews for your organization</p>
        </div>

        <div className="action-cards">
          <Link to="/create-interview" className="action-card create-card">
            <div className="card-icon">
              <i className="fas fa-plus-circle"></i>
            </div>
            <h3>Create Interview</h3>
            <p>Create a new interview and get a shareable code</p>
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Dashboard; 