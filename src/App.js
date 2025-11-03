import './App.css';
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import TopHeader from './components/TopHeader';
import SideNavbar from './components/SideNavbar';
import AudioPlayer from './AudioPlayer';
import MainPageBody from './components/MainPageBody';
import Login from './components/Login';
import SignUp from './components/SignUp';

// This is a new component to hold your main app layout
function MainAppLayout({ isLoggedIn, onLogout }) {
  const [currentPage, setCurrentPage] = React.useState('home');

  return (
    <div className="App">
      <TopHeader isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <div className="main-content">
        <SideNavbar setCurrentPage={setCurrentPage} />
        <div className="page-body">
          <MainPageBody currentPage={currentPage} />
        </div>
      </div>
      <div className="audio-bar">
        <div className="song-info">
          <img
            src="https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900"
            alt="Song Poster"
          />
          <div className="song-details">
            Everyday <br />
            <span>Ariana Grande</span>
          </div>
        </div>
        <div className="player-wrapper">
          <AudioPlayer />
        </div>
        <div className="audio-controls-right" />
      </div>
    </div>
  );
}

// App.js now becomes the router
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/'); // On login, go to the main app
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login'); // On logout, go to login
  };

  return (
    <Routes>
      {/* Route for Login Page */}
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      
      {/* Route for Sign Up Page */}
      <Route path="/signup" element={<SignUp />} />

      {/* Route for the Main App (protected) */}
      <Route 
        path="/*" 
        element={
          isLoggedIn ? (
            <MainAppLayout isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
}

export default App;