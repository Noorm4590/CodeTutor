// src/pages/Welcome.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = ({ user }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/generate-video');
    } else {
      navigate('/login');
    }
  };


  return (
    <div className="welcome">

      <main className="welcome-main">
        <div className="welcome-content">
          <h1 className="welcome-title">CodeTutor AI</h1>
          <p className="welcome-subtitle">
            Your personal AI tutor — transforming coding questions into engaging video explanations.
          </p>
          <div className="welcome-buttons">
            <button className="btn btn-secondary" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
        </div>
      </main>

      <footer className="welcome-footer">
        <p>&copy; {new Date().getFullYear()} CodeTutor AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Welcome;
