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
  album_name: "Dangerous Woman"
};

// Helper function to decode JWT
function jwtDecode(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
}

// --- MainAppLayout ---
// (A) Changed 'user' prop to 'username' string prop
function MainAppLayout({ 
  token, 
  username, // <-- CHANGED
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
        username={username} // <-- CHANGED
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
          {/* ... audio bar content ... (unchanged) */}
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
  const [username, setUsername] = useState(null); // <-- (B) CHANGED to username string state
  const [isAudioBarVisible, setIsAudioBarVisible] = useState(true);
  const [currentSong, setCurrentSong] = useState(defaultSong);
  const [libraryView, setLibraryView] = useState({ type: 'liked' });
  const [likedSongsMap, setLikedSongsMap] = useState({}); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiked = async () => {
      // ... fetchLiked logic (unchanged) ...
       if (token) {
        try {
          const response = await api.get('/api/liked/');
          const songsFromDb = Array.isArray(response.data.songs) ? response.data.songs : 
                            Array.isArray(response.data) ? response.data : [];
          
          const likeMap = songsFromDb.reduce((acc, song) => {
            if (song.track_id) {
              acc[song.track_id] = true;
            }
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

    // (C) SET USERNAME WHEN TOKEN CHANGES
    if (token) {
      const decodedUser = jwtDecode(token);
      if (decodedUser) {
        // Assuming the payload has a 'name' field
        setUsername(decodedUser.name); // <-- CHANGED
      }
    } else {
      setUsername(null); // <-- CHANGED
    }
  }, [token]);


  // (D) handleLikeToggle (Fixed 'unlike' logic)
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
        // --- UNLIKE (Fixed) ---
        await api.delete(`/api/liked/${trackId}`);
        
      } else {
        // --- LIKE (Fixed) ---
        await api.post('/api/liked/add', { 
            songId: trackId,
            title: song.name,
            artist: song.artist, 
            album: song.album || song.album_name || '',
            coverImage: song.image,
            preview: song.src
        });
      }
      
      setLikedSongsMap(prev => ({ ...prev, [trackId]: !isLiked }));

      if (libraryView.type === 'liked') {
        setLibraryView({ type: 'liked', refresh: Date.now() });
      }
    } catch (err) {
      console.error("Like error:", err.response ? err.response.data : err);
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
    // (E) Set username on login
    const decodedUser = jwtDecode(newToken);
    if (decodedUser) {
      setUsername(decodedUser.name); // <-- CHANGED
    }
    navigate('/'); 
  };

  const handleLogout = () => {
    setToken(null); 
    setUsername(null); // (F) Clear username on logout
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
            username={username} // <-- (G) PASS USERNAME
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