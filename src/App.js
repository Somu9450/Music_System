import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TopHeader from './components/TopHeader';
import SideNavbar from './components/SideNavbar';
import AudioPlayer from './AudioPlayer';
import MainPageBody from './components/MainPageBody';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // Point 1
import FavoriteIcon from '@mui/icons-material/Favorite'; // Point 1
import api from './api'; // Point 1: Auth API

const defaultSong = {
  id: "5c00aeb796dc03f5abcc276ad7a0a7f7c1b4f01b", 
  name: "Everyday",
  artist: "Ariana Grande",
  image: "https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900",
  src: "https://p.scdn.co/mp3-preview/5c00aeb796dc03f5abcc276ad7a0a7f7c1b4f01b?cid=774b29d4f13844c495f206cafdad9c86"
};

// Main layout component
function MainAppLayout({ 
  token, 
  onLogout, 
  isAudioBarVisible, 
  setIsAudioBarVisible, 
  currentSong, 
  setCurrentSong,
  libraryView, 
  setLibraryView,
  likedSongsMap, // Point 1
  handleLikeToggle // Point 1
}) {
  const [currentPage, setCurrentPage] = React.useState('home');

  return (
    <div className="App">
      <TopHeader 
        isLoggedIn={!!token} 
        onLogout={onLogout} 
        setCurrentSong={setCurrentSong}
        setIsAudioBarVisible={setIsAudioBarVisible}
        token={token} 
      />
      <div className="main-content">
        <SideNavbar 
          setCurrentPage={setCurrentPage} 
          setLibraryView={setLibraryView} 
        />
        <div className={`page-body ${currentPage === "library" ? "page-body-library" : "page-body-home"}`}>
          <MainPageBody
            currentPage={currentPage}
            setIsAudioBarVisible={setIsAudioBarVisible}
            setCurrentSong={setCurrentSong}
            token={token} 
            libraryView={libraryView} 
            setLibraryView={setLibraryView} 
            setCurrentPage={setCurrentPage}
            likedSongsMap={likedSongsMap} // Point 1: Pass down
            handleLikeToggle={handleLikeToggle} // Point 1: Pass down
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
            {/* Point 1: Like icon in audio player */}
            <div 
              className={`heart-icon-player ${likedSongsMap[currentSong.id] ? 'liked' : ''}`}
              onClick={() => handleLikeToggle(currentSong)}
            >
              {likedSongsMap[currentSong.id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
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


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAudioBarVisible, setIsAudioBarVisible] = useState(true);
  const [currentSong, setCurrentSong] = useState(defaultSong);
  const [libraryView, setLibraryView] = useState({ type: 'liked' });
  const [likedSongsMap, setLikedSongsMap] = useState({}); // Point 1: Global like state
  const navigate = useNavigate();

  // Point 1: Fetch liked songs when user logs in
  useEffect(() => {
    const fetchLiked = async () => {
      if (token) {
        try {
          const response = await api.get('/api/liked/');
          const songsFromDb = response.data.songs || [];
          const likeMap = songsFromDb.reduce((acc, song) => {
            acc[song.track_id || song._id] = true; // Use track_id as key
            return acc;
          }, {});
          setLikedSongsMap(likeMap);
        } catch (err) {
          console.error("Failed to fetch liked songs status", err);
        }
      } else {
        setLikedSongsMap({}); // Clear likes on logout
      }
    };
    fetchLiked();
  }, [token]);

  // Point 1: Global function to handle liking/unliking a song
  const handleLikeToggle = async (song, e) => {
    if (e) e.stopPropagation(); // Prevent row click if called from library
    
    if (!token) {
      alert("Please log in to like songs");
      return;
    }
    if (!song || !song.id) {
      console.error("Cannot like a song with no ID", song);
      return;
    }

    const trackId = song.id; 
    const isLiked = !!likedSongsMap[trackId];

    try {
      if (isLiked) {
        // --- UNLIKE ---
        // We need the backend's internal _id to delete
        const likedResponse = await api.get('/api/liked/');
        const songToUnlike = likedResponse.data.songs.find(s => (s.track_id || s._id) === trackId);
        if (songToUnlike) {
          await api.delete(`/api/liked/${songToUnlike._id}`);
        }
      } else {
        // --- LIKE ---
        await api.post('/api/liked/add', { 
          songId: trackId, // Send track_id as songId
          // Send all song data so backend can create it
          name: song.name,
          artist: song.artist,
          image: song.image,
          src: song.src,
          track_id: trackId 
        });
      }
      
      // Update local state
      setLikedSongsMap(prev => ({ ...prev, [trackId]: !isLiked }));

      // If we are on the 'liked' page, force a reload
      if (libraryView.type === 'liked') {
        setLibraryView({ type: 'liked', refresh: Date.now() }); // Force refresh
      }

    } catch (err) {
      console.error("Like error:", err);
      alert("Failed to update liked songs.");
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    navigate('/'); 
  };

  const handleLogout = () => {
    setToken(null); 
    navigate('/'); 
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
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
            libraryView={libraryView} 
            setLibraryView={setLibraryView} 
            likedSongsMap={likedSongsMap} // Point 1
            handleLikeToggle={handleLikeToggle} // Point 1
          />
        } 
      />
    </Routes>
  );
}

export default App;