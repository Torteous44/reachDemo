import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './misc/Navbar';
import '../styles/InterviewLanding.css';

function InterviewLanding() {
  const { hexCode } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await fetch(`https://demobackend-p2e1.onrender.com/interviews/code/${hexCode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.detail || 'Failed to load interview');
        }

        setInterview(data);
      } catch (err) {
        console.error('Error fetching interview:', err);
        setError(err.message || 'Failed to load interview');
      } finally {
        setIsLoading(false);
      }
    };

    if (hexCode) {
      fetchInterview();
    }
  }, [hexCode]);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const response = await fetch('https://demobackend-p2e1.onrender.com/sessions/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          interview_id: interview.id
        })
      });

      const data = await response.json();
      console.log('Session response:', data);
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to start session');
      }

      if (!data.id) {
        throw new Error('Invalid session response');
      }

      navigate(`/session/${data.id}`);
    } catch (err) {
      console.error('Session start error:', err);
      setError('Failed to start interview session. Please try again.');
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="interview-wrapper">
        <Navbar />
        <div className="interview-loading">
          <div className="loading-spinner"></div>
          <p>Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="interview-wrapper">
        <Navbar />
        <div className="interview-error">
          <div className="error-card">
            <h2>Interview Not Found</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/access')}>Try Another Code</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-wrapper">
      <Navbar />
      <div className="interview-landing">
        <div className="interview-container">
          <div className="interview-card">
            <div className="interview-header">
              <h1>{interview?.name}</h1>
              <div className="interview-code">
                Code: <span>{hexCode}</span>
              </div>
            </div>

            <div className="interview-content">
              <div className="content-section">
                <h2>Scope</h2>
                <p>{interview?.scope}</p>
              </div>

              <div className="content-section">
                <h2>About</h2>
                <p>{interview?.description}</p>
              </div>
            </div>

            <div className="interview-actions">
              <button
                className="back-button"
                onClick={() => navigate('/access')}
              >
                Go Back
              </button>
              <button
                className="start-button"
                onClick={handleStart}
                disabled={isStarting}
              >
                {isStarting ? 'Starting...' : 'Start Interview'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewLanding; 