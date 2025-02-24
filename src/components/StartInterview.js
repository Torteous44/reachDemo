import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/StartInterview.css';

function StartInterview() {
  const { hexCode } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await fetch(`http://localhost:8000/interviews/access/${hexCode}`);
        const data = await response.json();
        
        if (response.ok) {
          setInterview(data);
        } else {
          throw new Error(data.message || 'Invalid interview code');
        }
      } catch (err) {
        setError(err.message);
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
      const response = await fetch('http://localhost:8000/sessions/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          interview_id: interview.id
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        navigate(`/session/${data.session_id}`);
      } else {
        throw new Error(data.message || 'Failed to start interview');
      }
    } catch (err) {
      setError(err.message);
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return <div className="interview-loading">Loading interview details...</div>;
  }

  if (error) {
    return (
      <div className="interview-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  return (
    <div className="interview-landing">
      <div className="interview-container">
        <div className="interview-header">
          <h1>{interview?.name}</h1>
          <div className="interview-code">
            Interview Code: <span>{hexCode}</span>
          </div>
        </div>

        <div className="interview-section">
          <h2>Scope</h2>
          <p>{interview?.scope}</p>
        </div>

        <div className="interview-section">
          <h2>About this Interview</h2>
          <p>{interview?.description}</p>
        </div>

        <div className="interview-actions">
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
  );
}

export default StartInterview; 