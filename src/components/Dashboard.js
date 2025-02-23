import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="welcome-section">
          <h2>Welcome to Reach Demo</h2>
          <p>Conduct AI-powered user interviews and get insights faster</p>
        </div>

        <div className="action-cards">
          <Link to="/interviews/create" className="action-card">
            <div className="card-icon">
              <i className="fas fa-plus-circle"></i>
            </div>
            <h3>Create Interview</h3>
            <p>Set up a new interview template with custom questions</p>
          </Link>

          <Link to="/interviews/start" className="action-card">
            <div className="card-icon">
              <i className="fas fa-play-circle"></i>
            </div>
            <h3>Start Interview</h3>
            <p>Begin a new interview session using existing templates</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 