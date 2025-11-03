import React from 'react';
import './LibraryDesign.css';
import { FiHeart } from "react-icons/fi";
// import api from '../api/axiosInstance';

export default function LibraryDesign({prop}) {
  const handleLike = async (song) => {""}
//   try {
//     await api.post("/songs/liked", song);
//     console.log("Added to liked songs!");
//   } catch (err) {
//     console.error("Error adding to liked:", err);
//   }
// };

  return (
    
    <div className='page-container'>
      <div className='page-head'>
        <h1>My Library</h1>
      </div>

      <div className='playlist-grid'>
        <div className='playlist'>
          <div className='playlist-head'>{prop.playlistTitle}</div>
          <div className='playlist-content'>
            {[...Array(8)].map((_, i) => (
              <div className="song-row" key={i}>
                <img src="https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900" alt="Song_poster" />
                <div>Everyday <span>Ariana Grande</span></div>
                <div className='like-icon' onClick={handleLike}><FiHeart className='heart-icon' /></div>
              </div>
            ))}
          </div>
        </div>

        <div className='grid-menus'>
          <div className='grid-menu-head'>{prop.gridTitle}</div>
          <div className='grid-menu-content'>
            {[...Array(10)].map((_, i) => (
              <div className="menu-tile">
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
