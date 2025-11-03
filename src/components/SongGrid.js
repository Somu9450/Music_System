import React, { useRef } from 'react';
import './SongGrid.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';

// Point 7: Accept setIsAudioBarVisible
export default function SongGrid({ prop, setIsAudioBarVisible }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const handleTileClick = () => {
    // Point 7: When a song/tile is clicked, show the audio bar
    if (setIsAudioBarVisible) {
      setIsAudioBarVisible(true);
    }
    // In a real app, this would also set the song context
    navigate(`/library/${prop}`);
  };

  return (
    <>
      <div className="grid-header">
        <div className='grid-name'><span>{prop}</span></div>
        <div className="see-all" onClick={handleTileClick}>See All</div>
      </div>

      <div className="grid-flex">
        <div className="arrow-icon" onClick={scrollLeft}><ArrowBackIosIcon fontSize="large" color='primary' /></div>
        <div className="song-grid" ref={scrollRef}>
          {[...Array(10)].map((_, i) => (
            <div className="song-tile" key={i} onClick={handleTileClick}>
              <img src="https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900" alt="Song_poster" />
              <div>Everyday</div>
              <span>Ariana Grande</span>
            </div>
          ))}
        </div>
        <div className="arrow-icon" onClick={scrollRight}><ArrowForwardIosIcon fontSize="large" color='primary' /></div>
      </div>
    </>
  );
}