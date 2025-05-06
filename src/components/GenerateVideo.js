// src/pages/Generate.js

import React, { useState } from 'react';
import axios from 'axios';
import './GenerateVideo.css';

const Generate = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [videoLink, setVideoLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMsg = { type: 'user', text: prompt };
    setMessages([...messages, userMsg]);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/generate_video',
        { prompt },
        { responseType: 'blob' }
      );

      const videoURL = window.URL.createObjectURL(new Blob([response.data]));
      const botMsg = {
        type: 'bot',
        text: 'Here is your generated video!',
        video: videoURL,
      };

      setMessages((prev) => [...prev, botMsg]);
      setVideoLink(videoURL);
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Failed to generate video. Please try again later.');
    } finally {
      setPrompt('');
      setIsLoading(false);
    }
  };

  return (
    <div className="generate-page">
      <div className="generate-content">
        <div className="chat-window">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <h2>CodeTutor AI</h2>
              <p>Enter a coding question to generate an educational video!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type}`}>
                <div className="chat-bubble">
                  <p>{msg.text}</p>
                  {msg.video && (
                    <video
                      controls
                      src={msg.video}
                      style={{
                        marginTop: '10px',
                        maxWidth: '100%',
                        borderRadius: '12px',
                      }}
                    ></video>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            placeholder="Ask to generate a coding video..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? '...' : '→'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Generate;
