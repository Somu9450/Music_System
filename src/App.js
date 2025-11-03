import './App.css';
import React, { useState, useEffect } from 'react'; // Import useEffect
import { Routes, Route, useNavigate } from 'react-router-dom';
import TopHeader from './components/TopHeader';
import SideNavbar from './components/SideNavbar';
import AudioPlayer from './AudioPlayer';
import MainPageBody from './components/MainPageBody';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CloseIcon from '@mui/icons-material/Close';

const defaultSong = {
  id: "default", // Added an ID
  name: "Everyday",
  artist: "Ariana Grande",
  image: "https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900",
  src: "https://p.scdn.co/mp3-preview/5c00aeb796dc03f5abcc276ad7a0a7f7c1b4f01b?cid=774b29d4f13844c495f206cafdad9c86"
};

// Main layout component
function MainAppLayout({ token, onLogout, isAudioBarVisible, setIsAudioBarVisible, currentSong, setCurrentSong }) {
  const [currentPage, setCurrentPage] = React.useState('home');

  return (
    <div className="App">
      <TopHeader isLoggedIn={!!token} onLogout={onLogout} />
      <div className="main-content">
        <SideNavbar setCurrentPage={setCurrentPage} />
        <div className={`page-body ${currentPage === "library" ? "page-body-library" : "page-body-home"}`}>
          <MainPageBody
            currentPage={currentPage}
            setIsAudioBarVisible={setIsAudioBarVisible}
            setCurrentSong={setCurrentSong}
            token={token} // Pass token down
          />
        </div>
      </div>

      {isAudioBarVisible && (
        <div className="audio-bar">
          <div className="song-info">
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

// App component handles routing and auth state
function App() {
  // Use token from localStorage as initial state
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAudioBarVisible, setIsAudioBarVisible] = useState(true);
  const [currentSong, setCurrentSong] = useState(defaultSong);
  const navigate = useNavigate();

  // Update localStorage when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    navigate('/'); // On login, go to the main app
  };

  const handleLogout = () => {
    setToken(null); // This will trigger the useEffect
    navigate('/'); // On logout, go to homepage
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      
      {/* Pass onLogin to SignUp to automatically log in after verification */}
      <Route path="/signup" element={<SignUp onSignUpSuccess={handleLogin} />} />

      <Route 
        path="/*" 
        element={
          <MainAppLayout
            token={token}
            onLogout={handleLogout}
            isAudioBarVisible={isAudioBarVisible}
            setIsAudioBarVisible={setIsAudioBarVisible}
            currentSong={currentSong}
            setCurrentSong={setCurrentSong}
          />
        } 
      />
    </Routes>
  );
}

export default App;