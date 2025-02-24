import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../auth/Login';
import Register from '../auth/Register';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import '../../styles/LandingPage.css';

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
          <div className="hero-left">
            <img src="/assets/logo.svg" alt="Reach" className="large-logo" />
          </div>
          <div className="hero-right">
            <h1 className="hero-title">
              Reach <span className="emphasis">Demo</span>
            </h1>
            <p className="hero-description">
            AI-driven interviews and high quality data insights faster and cheaper than traditional research methods.            </p>
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
      </div>

      <div className="demo-info">
        <div className="demo-info-content">
          <h2 className="demo-info-title">About This Demo</h2>
          <div className="demo-features">
            <div className="feature-item">
              <h3>Create Templates</h3>
              <p>Design custom interview flows and questions</p>
            </div>
            <div className="feature-item">
              <h3>AI Interviews</h3>
              <p>Experience natural conversations with our AI</p>
            </div>
            <div className="feature-item">
              <h3>Voice Interaction</h3>
              <p>Test our voice recognition capabilities</p>
            </div>
            <div className="feature-item">
              <h3>Review Insights</h3>
              <p>Get AI-generated feedback and transcripts</p>
            </div>
          </div>
          <div className="demo-note">
            <p>This is a limited demonstration. For full access, please contact our team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage; 