import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './misc/Navbar';
import '../styles/AccessInterview.css';

function AccessInterview() {
  const [hexCode, setHexCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hexCode.trim().length === 4) {
      navigate(`/interview/${hexCode.toUpperCase()}`);
    } else {
      setError('Please enter a valid 4-character code');
    }
  };

  return (
    <div className="access-wrapper">
      <Navbar />
      <div className="access-container">
        <div className="access-card">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="back-button"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1>Access Interview</h1>
          
          <p className="access-description">
            Enter the 4-character code provided to you
          </p>
          
          <form onSubmit={handleSubmit} className="access-form">
            <div className="code-input-container">
              <input
                type="text"
                value={hexCode}
                onChange={(e) => {
                  setError('');
                  setHexCode(e.target.value.toUpperCase());
                }}
                placeholder="Enter code"
                maxLength="4"
                className={error ? 'error' : ''}
                required
              />
              {error && <div className="error-message">{error}</div>}
            </div>
            
            <button type="submit" className="access-button">
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AccessInterview; 