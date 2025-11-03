import './App.css';
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TopHeader from './components/TopHeader';
import SideNavbar from './components/SideNavbar';
import AudioPlayer from './AudioPlayer';
import MainPageBody from './components/MainPageBody';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CloseIcon from '@mui/icons-material/Close'; // Added for audio bar

// This is a new component to hold your main app layout
function MainAppLayout({ isLoggedIn, onLogout, isAudioBarVisible, setIsAudioBarVisible }) {
  const [currentPage, setCurrentPage] = React.useState('home');

  return (
    <div className="App">
      <TopHeader isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <div className="main-content">
        <SideNavbar setCurrentPage={setCurrentPage} />
        <div className="page-body">
          <MainPageBody
            currentPage={currentPage}
            setIsAudioBarVisible={setIsAudioBarVisible} // Pass setter down
          />
        </div>
      </div>

      {/* Point 7: Conditionally render audio bar */}
      {isAudioBarVisible && (
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
          {/* Point 7: Close button */}
          <div className="audio-controls-right">
            <CloseIcon
              className="audio-close-btn"
              onClick={() => setIsAudioBarVisible(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// App.js now becomes the router
function App() {
  // Point 1: Default to false, so Login/Signup buttons show
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Point 7: Add state for audio bar
  const [isAudioBarVisible, setIsAudioBarVisible] = useState(true);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/'); // On login, go to the main app
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/'); // Point 5: On logout, go to homepage
  };

  return (
    <Routes>
      {/* Route for Login Page */}
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      
      {/* Route for Sign Up Page */}
      <Route path="/signup" element={<SignUp />} />

      {/* Point 1: Route for the Main App (no longer protected) */}
      <Route 
        path="/*" 
        element={
          <MainAppLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            isAudioBarVisible={isAudioBarVisible}
            setIsAudioBarVisible={setIsAudioBarVisible}
          />
        } 
      />
    </Routes>
  );
}

export default App;