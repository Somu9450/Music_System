import React, { useRef } from 'react';
import './SongGrid.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';

// Point 3: Mock data for grid
const mockSong = {
  name: "Everyday",
  artist: "Ariana Grande",
  image: "https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900",
  src: "https://p.scdn.co/mp3-preview/5c00aeb796dc03f5abcc276ad7a0a7f7c1b4f01b?cid=774b29d4f13844c495f206cafdad9c86"
};

// Point 3: Accept setCurrentSong
export default function SongGrid({ prop, setIsAudioBarVisible, showSeeAll = true, setCurrentSong }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Point 3: Update to set song
  const handleTileClick = () => {
    if (setIsAudioBarVisible) {
      setIsAudioBarVisible(true);
    }
    setCurrentSong(mockSong); // Set mock song
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
          {[...Array(10)].map((_, i) => (
            <div className="song-tile" key={i} onClick={handleTileClick}>
              <img src={mockSong.image} alt="Song_poster" />
              <div>{mockSong.name}</div>
              <span>{mockSong.artist}</span>
            </div>
          ))}
        </div>
        <div className="arrow-icon" onClick={scrollRight}><ArrowForwardIosIcon fontSize="large" color='primary' /></div>
      </div>
    </>
  );
}