// src/pages/About.js

import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-content">
        <h1>About CodeTutor AI</h1>
        <p className="about-description">
          CodeTutor AI is an intelligent platform that transforms complex coding questions into simplified, engaging video explanations using AI. Designed for developers and students alike, our tool helps users master programming concepts with ease and clarity.
        </p>

        <div className="about-video-container">
          <video controls className="about-video">
            <source src="/videos/about-us.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <h2 className="creator-title">Meet the Creators</h2>
        <div className="creators-container">
          <div className="creator-card">
            <div className="creator-photo placeholder-photo">N</div>
            <h3>Noor Muhammad</h3>
            <p>k214590@nu.edu.pk</p>
          </div>
          <div className="creator-card">
            <div className="creator-photo placeholder-photo">M</div>
            <h3>Muhammad Mubashir</h3>
            <p>k213353@nu.edu.pk</p>
          </div>
          <div className="creator-card">
            <div className="creator-photo placeholder-photo">R</div>
            <h3>Abdul Rafay</h3>
            <p>k214591@nu.edu.pk</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
