import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <img src="/assets/logo.svg" alt="Reach Logo" className="nav-logo" />
          <div className="demo-badge">Demo</div>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar; 