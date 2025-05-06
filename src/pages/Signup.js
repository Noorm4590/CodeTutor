// src/pages/Signup.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';
import Swal from 'sweetalert2';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:"<>?[\]\\;',./`~]).{6,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setError(
        'Password must have at least 1 uppercase letter, 1 number, and 1 special character.'
      );
      return;
    }

    setError('');

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        name: fullName,
        email,
        password,
      });

      Swal.fire({
            title: 'Success!',
            text: 'You have created an account',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/');
          });
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">Create Your Account</h1>
        <p className="signup-subtitle">Sign up to get started with CodeTutor AI</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        <p className="signup-footer-text">
          Already have an account? <Link to="/login" className="login-link">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
