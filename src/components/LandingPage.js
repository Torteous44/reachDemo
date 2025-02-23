import React from 'react';
import { Link } from 'react-router-dom';
import AudioVisualizer from './AudioVisualizer';
import '../styles/LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <nav className="demo-nav">
        <div className="logo">
          <img src="/assets/logo.svg" alt="Reach Logo" className="logo-image" />
        </div>
        <div className="demo-badge">Demo</div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Reach helps you conduct user interviews in hours,{' '}
            <span className="emphasis">not days</span>
          </h1>
          
          <p className="hero-description">
            We conduct AI-driven interviews and deliver high quality data insights
            faster and cheaper than traditional research methods.
          </p>

          <Link to="/login" className="try-demo-button">
            Try Demo
          </Link>
        </div>

        <div className="hero-visual">
          <div className="visualizer-container">
            <AudioVisualizer />
          </div>
        </div>
      </div>

      <div className="demo-notice">
        <h2>About This Demo</h2>
        <p>
          This is a demonstration version of Reach, showcasing our AI-powered interview capabilities.
          In this demo, you can:
        </p>
        <ul>
          <li>Create and manage interview templates</li>
          <li>Conduct AI-driven interviews</li>
          <li>Experience real-time voice interactions</li>
          <li>Review interview transcripts</li>
        </ul>
        <p className="demo-disclaimer">
          Note: This is a limited demo version. For full access to Reach's features and capabilities,
          please contact our team.
        </p>
      </div>
    </div>
  );
}

export default LandingPage; 