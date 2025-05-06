// src/components/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });

      if (res.data.status === "success") {
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: res.data.message,
          timer: 2000,
          showConfirmButton: false
        });

        setUser(null);
      }
    } catch (error) {
      console.error("Logout error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Something went wrong while logging out.'
      });
    }
  };

  const handleGenerateClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/generate-video");
    }
  };

  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // Scrolling down
      } else {
        setShowNavbar(true); // Scrolling up
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${showNavbar ? 'show' : 'hide'}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">CodeTutor AI</Link>
      </div>
      <div className="navbar-right">
        <button onClick={handleGenerateClick} className="btn btn-small">Generate Video</button>
        <Link to="/about" className="nav-link">About</Link>

        {!user ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        ) : (
          <div className="user-info">
            <i className="fas fa-user-circle"></i>
            <span>{user}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
