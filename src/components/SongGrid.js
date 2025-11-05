import React, { useRef } from 'react';
import './SongGrid.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 

export default function SongGrid({ 
  prop, 
  setIsAudioBarVisible, 
  showSeeAll = true, 
  setCurrentSong, 
  token, 
  songs = [],
  onSeeAllClick 
}) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // --- THIS FUNCTION IS NOW FIXED ---
  const handleRecentApiCall = async (song) => {
    if (token) {
      try {
        // Send the keys the backend controller (recentController.js) expects
        await api.post('/api/recent/add', { 
          songId: song.id,           // ✅ Backend expects 'songId'
          title: song.name,          // ✅ Backend expects 'title'
          artist: song.artist,       // ✅ Backend expects 'artist'
          album: song.album_name || '', // ✅ Backend expects 'album'
          coverImage: song.image,    // ✅ Backend expects 'coverImage'
          preview: song.src          // ✅ Backend expects 'preview'
        });
      } catch (err) {
        console.warn(
          "Note: 'Add to Recent' API failed.",
          err.response?.data?.message || err.message
        );
      }
    }
  };

  const handleTileClick = (song) => {
    if (!token) {
      alert("Please login to play music.");
      return;
    }
    
    if (setIsAudioBarVisible) {
      setIsAudioBarVisible(true);
    }
    setCurrentSong(song);
    handleRecentApiCall(song); // This will now work
  };

  const handleSeeAll = onSeeAllClick ? onSeeAllClick : () => {
     navigate(`/library/${prop}`);
  };

  return (
    <>
      <div className="grid-header">
        <div className='grid-name'><span>{prop}</span></div>
        {showSeeAll && (
          <div className="see-all" onClick={handleSeeAll}>See All</div>
        )}
      </div>

      <div className="grid-flex">
        <div className="arrow-icon" onClick={scrollLeft}><ArrowBackIosIcon fontSize="large" color='primary' /></div>
        
        <div className="song-grid" ref={scrollRef}>
          {songs.length > 0 ? (
            songs.map((song) => (
              <div className="song-tile" key={song.id} onClick={() => handleTileClick(song)}>
                <img src={song.image} alt={song.name} />
                <div>{song.name}</div>
                <span>{song.artist}</span>
              </div>
            ))
          ) : (
            <p style={{ color: '#aaa', marginLeft: '20px' }}>Loading songs...</p>
          )}
        </div>
        
        <div className="arrow-icon" onClick={scrollRight}><ArrowForwardIosIcon fontSize="large" color='primary' /></div>
      </div>
    </>
  );
}