import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import '../styles/LandingPage.css';

function LandingPage() {
  const { user } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleShowLogin = () => {
    openModal(<Login />);
  };

  const handleShowRegister = () => {
    openModal(<Register />);
  };

  return (
    <div className="landing-container">
      <nav className="demo-nav">
        <div className="logo">
          <img src="/assets/logo.svg" alt="Reach Logo" className="logo-image" />
          <div className="demo-badge">Demo</div>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-logo">
            <img src="/assets/logo.svg" alt="Reach" />
          </div>
          <h1 className="hero-title">
            Reach <span className="emphasis">Demo</span>
          </h1>
          
          <div className="hero-actions">
            <button 
              className="hero-button" 
              onClick={handleShowLogin}
            >
              Sign in
            </button>
            <button 
              className="hero-button primary" 
              onClick={handleShowRegister}
            >
              Create account
            </button>
          </div>
        </div>
      </div>

      <div className="demo-info">
        <div className="demo-info-content">
          <h2>About This Demo</h2>
          <div className="demo-features">
            <div className="feature-item">
              <h3>Create Templates</h3>
              <p>Design and manage interview templates with custom questions and flows</p>
            </div>
            <div className="feature-item">
              <h3>AI Interviews</h3>
              <p>Experience real-time AI-driven interviews with natural conversations</p>
            </div>
            <div className="feature-item">
              <h3>Voice Interaction</h3>
              <p>Test our advanced voice recognition and response capabilities</p>
            </div>
            <div className="feature-item">
              <h3>Review Insights</h3>
              <p>Access detailed transcripts and AI-generated insights from interviews</p>
            </div>
          </div>
          <div className="demo-note">
            <p>This is a limited demonstration version. For full access to Reach's features, please contact our team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage; 