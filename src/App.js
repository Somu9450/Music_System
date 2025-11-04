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
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import api from './api'; 

const defaultSong = {
  id: "5c00aeb796dc03f5abcc276ad7a0a7f7c1b4f01b", 
  name: "Everyday",
  artist: "Ariana Grande",
  image: "https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900",
  src: "https://p.scdn.co/mp3-preview/5c00aeb796dc03f5abcc276ad7a0a7f7c1b4f01b?cid=774b29d4f13844c495f206cafdad9c86",
  album_name: "Dangerous Woman" // Added for completeness
};

// MainAppLayout remains the same
function MainAppLayout({ 
  token, 
  onLogout, 
  isAudioBarVisible, 
  setIsAudioBarVisible, 
  currentSong, 
  setCurrentSong,
  libraryView, 
  setLibraryView,
  likedSongsMap, 
  handleLikeToggle 
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
            likedSongsMap={likedSongsMap} 
            handleLikeToggle={handleLikeToggle} 
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
  const [likedSongsMap, setLikedSongsMap] = useState({}); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiked = async () => {
      if (token) {
        try {
          const response = await api.get('/api/liked/');
          const songsFromDb = response.data.songs || [];
          const likeMap = songsFromDb.reduce((acc, song) => {
            acc[song.track_id || song._id] = true; 
            return acc;
          }, {});
          setLikedSongsMap(likeMap);
        } catch (err) {
          console.error("Failed to fetch liked songs status", err);
        }
      } else {
        setLikedSongsMap({}); 
      }
    };
    fetchLiked();
  }, [token]);

  // Global function to handle liking/unliking a song
  const handleLikeToggle = async (song, e) => {
    if (e) e.stopPropagation(); 
    
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
        const likedResponse = await api.get('/api/liked/');
        const songToUnlike = likedResponse.data.songs.find(s => (s.track_id || s._id) === trackId);
        if (songToUnlike) {
          await api.delete(`/api/liked/${songToUnlike._id}`);
        }
      } else {
        // --- LIKE (FIXED) ---
        // We now send the keys the backend model expects
        await api.post('/api/liked/add', { 
          songId: trackId, // The ID to find/create by
          track_id: trackId,
          track_name: song.name,
          artists: song.artist,
          album_name: song.album_name,
          img: song.image,
          src: song.src
        });
      }
      
      setLikedSongsMap(prev => ({ ...prev, [trackId]: !isLiked }));

      if (libraryView.type === 'liked') {
        setLibraryView({ type: 'liked', refresh: Date.now() }); 
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
            likedSongsMap={likedSongsMap} 
            handleLikeToggle={handleLikeToggle} 
          />
        } 
      />
    </Routes>
  );
}

export default App;