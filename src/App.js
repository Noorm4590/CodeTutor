// src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Pages
import Welcome from './components/Welcome';
import About from './components/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GenerateVideo from './components/GenerateVideo';
import Navbar from './components/Navbar';

//axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/get_user', { withCredentials: true });
        if (res.data.loggedIn) {
          setUser(res.data.full_name);
        }
      } catch (err) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Welcome user={user} setUser={setUser} />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/generate-video" element={<GenerateVideo />} />
      </Routes>
    </Router>
  );
}

export default App;
