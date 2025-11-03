import React, { useState } from 'react'; // Point 2: Import useState
import './LibraryDesign.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // Point 2: Import heart icon
import FavoriteIcon from '@mui/icons-material/Favorite'; // Point 2: Import filled heart icon
// import api from '../api/axiosInstance';

export default function LibraryDesign({ prop = { playlistTitle: "My Playlist", gridTitle: "Liked Songs" }, setIsAudioBarVisible }) {
  
  // Point 2: Add state for liked songs (dummy example)
  const [likedSongs, setLikedSongs] = useState({});

  const handleLike = (e, songId) => {
    e.stopPropagation(); // Prevent song row click
    setLikedSongs(prev => ({
      ...prev,
      [songId]: !prev[songId] // Toggle like state
    }));
    // In a real app, you'd call your API here
    // try {
    //   await api.post("/songs/liked", song);
    //   console.log("Added to liked songs!");
    // } catch (err) {
    //   console.error("Error adding to liked:", err);
    // }
  };

  const handleSongClick = () => {
    if (setIsAudioBarVisible) {
      setIsAudioBarVisible(true);
    }
  };

  return (
    
    <div className='page-container'>
      <div className='page-head'>
        <h1>My Library</h1>
      </div>

      <div className='playlist-grid'>
        <div className='playlist'>
          <div className='playlist-head'>{prop.playlistTitle}</div>
          <div className='playlist-content'>
            {[...Array(20)].map((_, i) => ( // Increased array size to show scroll
              <div className="song-row" key={i} onClick={handleSongClick}>
                <img src="https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900" alt="Song_poster" />
                <div>Everyday <span>Ariana Grande</span></div>
                
                {/* Point 2: Added heart icon */}
                <div className={`heart-icon ${likedSongs[i] ? 'liked' : ''}`} onClick={(e) => handleLike(e, i)}>
                  {likedSongs[i] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </div>

              </div>
            ))}
          </div>
        </div>

        <div className='grid-menus'>
          <div className='grid-menu-head'>{prop.gridTitle}</div>
          <div className='grid-menu-content'>
            {[...Array(20)].map((_, i) => ( // Increased array size to show scroll
              <div className="menu-tile" key={i} onClick={handleSongClick}>
                <img src="https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900" alt='Song_poster' />
                <div>Everyday <span>Ariana Grande </span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}