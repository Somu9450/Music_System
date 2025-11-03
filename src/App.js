import './App.css';
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TopHeader from './components/TopHeader';
import SideNavbar from './components/SideNavbar';
import AudioPlayer from './AudioPlayer';
import MainPageBody from './components/MainPageBody';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CloseIcon from '@mui/icons-material/Close';

// Point 3: Create a default song object
const defaultSong = {
  name: "Everyday",
  artist: "Ariana Grande",
  image: "https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900",
  src: "https://p.scdn.co/mp3-preview/5c00aeb796dc03f5abcc276ad7a0a7f7c1b4f01b?cid=774b29d4f13844c495f206cafdad9c86"
};

// This component holds your main app layout
function MainAppLayout({ isLoggedIn, onLogout, isAudioBarVisible, setIsAudioBarVisible, currentSong, setCurrentSong }) {
  const [currentPage, setCurrentPage] = React.useState('home');

  return (
    <div className="App">
      <TopHeader isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <div className="main-content">
        <SideNavbar setCurrentPage={setCurrentPage} />
        <div className={`page-body ${currentPage === "library" ? "page-body-library" : "page-body-home"}`}>
          <MainPageBody
            currentPage={currentPage}
            setIsAudioBarVisible={setIsAudioBarVisible}
            setCurrentSong={setCurrentSong} // Point 3: Pass setter down
          />
        </div>
      </div>

      {isAudioBarVisible && (
        <div className="audio-bar">
          <div className="song-info">
            {/* Point 3: Use currentSong state */}
            <img
              src={currentSong.image}
              alt="Song Poster"
            />
            <div className="song-details">
              {currentSong.name} <br />
              <span>{currentSong.artist}</span>
            </div>
          </div>
          <div className="player-wrapper">
            {/* Point 3: Pass song src to AudioPlayer */}
            <AudioPlayer songSrc={currentSong.src} />
          </div>
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAudioBarVisible, setIsAudioBarVisible] = useState(true);
  // Point 3: Add currentSong state here
  const [currentSong, setCurrentSong] = useState(defaultSong);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/'); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/'); 
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route 
        path="/*" 
        element={
          <MainAppLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            isAudioBarVisible={isAudioBarVisible}
            setIsAudioBarVisible={setIsAudioBarVisible}
            currentSong={currentSong} // Point 3: Pass state
            setCurrentSong={setCurrentSong} // Point 3: Pass setter
          />
        } 
      />
    </Routes>
  );
}

export default App;