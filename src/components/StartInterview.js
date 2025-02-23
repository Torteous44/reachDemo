import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/StartInterview.css';

function StartInterview() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [startingSession, setStartingSession] = useState(false);
  const navigate = useNavigate();

  const fetchInterviews = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/interviews/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch interviews');
      }

      const data = await response.json();
      setInterviews(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleInterviewSelect = (interview) => {
    setSelectedInterview(interview);
    setShowConfirm(true);
  };

  const startInterview = async () => {
    setStartingSession(true);
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error('You must be logged in first.');
      }

      const resp = await fetch("http://localhost:8000/sessions/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ interview_id: selectedInterview.id })
      });

      if (!resp.ok) {
        throw new Error('Failed to start session');
      }

      const data = await resp.json();
      window.location.href = `/realtime/${data.id}`;
    } catch (err) {
      setError(err.message || 'Error starting session');
      setShowConfirm(false);
    } finally {
      setStartingSession(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading interviews...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="start-interview-wrapper">
      <Navbar />
      
      <div className="start-interview-container">
        <button 
          className="back-arrow" 
          onClick={() => navigate('/dashboard')}
          aria-label="Back to Dashboard"
        >
          ←
        </button>

        <div className="start-interview-header">
          <h2>Select Interview Template</h2>
          <p>Choose a template to begin your interview session</p>
        </div>

        <div className="interview-grid">
          {interviews.map((interview) => (
            <div 
              key={interview.id} 
              className="interview-card"
              onClick={() => handleInterviewSelect(interview)}
            >
              <div className="card-header">
                <h3>{interview.name}</h3>
                <span className="date">
                  {new Date(interview.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <p className="scope">{interview.scope}</p>
              
              <div className="questions-preview">
                <h4>Questions</h4>
                <ul>
                  {interview.questions.slice(0, 3).map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                  {interview.questions.length > 3 && (
                    <li className="more">+{interview.questions.length - 3} more questions</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {showConfirm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Start Interview Session</h3>
              <p>You are about to begin an interview using:</p>
              <div className="selected-template">
                <strong>{selectedInterview.name}</strong>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="cancel-button"
                  onClick={() => setShowConfirm(false)}
                  disabled={startingSession}
                >
                  Cancel
                </button>
                <button 
                  className="start-button"
                  onClick={startInterview}
                  disabled={startingSession}
                >
                  {startingSession ? "Starting..." : "Start Interview"}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && <div className="loading-overlay">Loading interviews...</div>}
        {error && <div className="error-message">Error: {error}</div>}
      </div>
    </div>
  );
}

export default StartInterview; 