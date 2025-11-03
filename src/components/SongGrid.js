import React, { useRef } from 'react';
import './SongGrid.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Import api

// Mock data (replace with prop if needed)
const mockSong = {
  id: "629f5f0b4f8d5a1b3c8f1e5d", // Example: A real ID from your DB for testing
  name: "Everyday",
  artist: "Ariana Grande",
  image: "https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900",
  src: "https://p.scdn.co/mp3-preview/5c00aeb796dc03f5abcc276ad7a0a7f7c1b4f01b?cid=774b29d4f13844c495f206cafdad9c86"
};

// Accept `songs` prop and `token`
export default function SongGrid({ prop, setIsAudioBarVisible, showSeeAll = true, setCurrentSong, token, songs = [] }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const handleRecentApiCall = async (songId) => {
    if (token) {
      try {
        await api.post('/api/recent/add', { songId: songId });
      } catch (err) {
        console.error("Failed to add to recently played", err.response?.data?.message);
      }
    }
  };

  const handleTileClick = (song) => {
    if (setIsAudioBarVisible) {
      setIsAudioBarVisible(true);
    }
    setCurrentSong(song);
    handleRecentApiCall(song.id); // Call recent API
  };

  const handleSeeAllClick = () => {
     navigate(`/library/${prop}`);
  };

  // Use fetched songs if available, otherwise use mock data
  const songsToDisplay = songs && songs.length > 0 ? songs : [...Array(10)].map(() => mockSong);

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
          {songsToDisplay.map((song, i) => (
            <div className="song-tile" key={song.id || i} onClick={() => handleTileClick(song)}>
              <img src={song.image || mockSong.image} alt="Song_poster" />
              <div>{song.name || "Song Title"}</div>
              <span>{song.artist || "Song Artist"}</span>
            </div>
          ))}
        </div>
        <div className="arrow-icon" onClick={scrollRight}><ArrowForwardIosIcon fontSize="large" color='primary' /></div>
      </div>
    </>
  );
}