import React, { useRef } from 'react';
import './SongGrid.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Auth backend API

// Accept `songs` prop
export default function SongGrid({ prop, setIsAudioBarVisible, showSeeAll = true, setCurrentSong, token, songs = [] }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const handleRecentApiCall = async (song) => {
    if (token) {
      try {
        // IMPORTANT: This call sends the *track_id* from the ML API.
        // Your Auth backend's `recentController` expects a MongoDB `_id`.
        // This call WILL FAIL unless the backend is updated.
        await api.post('/api/recent/add', { 
          songId: song.id, // This is the ML API's track_id
          // Sending full data in case backend creates the song
          name: song.name,
          artist: song.artist,
          image: song.image,
          src: song.src,
          track_id: song.id 
        });
      } catch (err) {
        console.warn(
          "Note: 'Add to Recent' API failed. This is expected if the ML API's track_id",
          `(${song.id}) does not exist in the Auth backend's 'songs' collection.`,
          err.response?.data?.message
        );
      }
    }
  };

  const handleTileClick = (song);Data => {
    if (setIsAudioBarVisible) {
      setIsAudioBarVisible(true);
    }
    // Pass the full normalized song object up
    setCurrentSong(songData);
    // Send to "Recently Played"
    handleRecentApiCall(songData);
  };

  const handleSeeAllClick = () => {
     navigate(`/library/${prop}`);
  };

  return (
    <>
      <div className="grid-header">
        <div className='grid-name'><span>{prop}</span></div>
        {showSeeAll && (
          <div className="see-all" onClick={handleSeeAllClick}>See All</div>
        )}
      </div>

      <div className="grid-flex">
        <div className="arrow-icon" onClick={scrollLeft}><ArrowBackIosIcon fontSize="large" color='primary' /></div>
        
        <div className="song-grid" ref={scrollRef}>
          {/* Use the 'songs' prop */}
          {songs.length > 0 ? (
            songs.map((song) => (
              <div className="song-tile" key={song.id} onClick={() => handleTileClick(song)}>
                <img src={song.image} alt={song.name} />
                <div>{song.name}</div>
                <span>{song.artist}</span>
              </div>
            ))
          ) : (
            // Show a loading/empty state
            <p style={{ color: '#aaa', marginLeft: '20px' }}>Loading songs...</p>
          )}
        </div>
        
        <div className="arrow-icon" onClick={scrollRight}><ArrowForwardIosIcon fontSize="large" color='primary' /></div>
      </div>
    </>
  );
}