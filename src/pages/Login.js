// src/pages/Login.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/login', { email, password }, { withCredentials: true });
      setUser(res.data.full_name); // Set user state
      localStorage.setItem('user', res.data.full_name); // ✅ Save to localStorage


    // ✅ Show sweetalert first, then navigate
    Swal.fire({
      title: 'Success!',
      text: 'You are logged in!',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      navigate('/');
    });



    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Log in to your CodeTutor AI account</p>

        <form className="login-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="login-btn">Log In</button>
        </form>

        <p className="login-footer-text">
          Don’t have an account? <Link to="/signup" className="signup-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
