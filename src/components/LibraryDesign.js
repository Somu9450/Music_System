import React from 'react';
import './LibraryDesign.css';
// import { FiHeart } from "react-icons/fi";
// import api from '../api/axiosInstance';

// Point 7: Accept setIsAudioBarVisible
export default function LibraryDesign({ prop = { playlistTitle: "My Playlist", gridTitle: "Liked Songs" }, setIsAudioBarVisible }) {
  
  const handleLike = async (song) => {""}
  //   try {
  //     await api.post("/songs/liked", song);
  //     console.log("Added to liked songs!");
  //   } catch (err) {
  //     console.error("Error adding to liked:", err);
  //   }
  // };

  // Point 7: Handler to show audio bar on song click
  const handleSongClick = () => {
    if (setIsAudioBarVisible) {
      setIsAudioBarVisible(true);
    }
    // ... other play logic would go here
  };

  return (
    
    <div className='page-container'>
      <div className='page-head'>
        <h1>My Library</h1>
      </div>

      <div className='playlist-grid'>
        <div className='playlist'>
          {/* This line will no longer cause an error */}
          <div className='playlist-head'>{prop.playlistTitle}</div>
          <div className='playlist-content'>
            {[...Array(8)].map((_, i) => (
              <div className="song-row" key={i} onClick={handleSongClick}> {/* Point 7 */}
                <img src="https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900" alt="Song_poster" />
                <div>Everyday <span>Ariana Grande</span></div>
                <div className='like-icon' onClick={handleLike}>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='grid-menus'>
          {/* This line will also no longer cause an error */}
          <div className='grid-menu-head'>{prop.gridTitle}</div>
          <div className='grid-menu-content'>
            {[...Array(10)].map((_, i) => (
              <div className="menu-tile" key={i} onClick={handleSongClick}> {/* Point 7 */}
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