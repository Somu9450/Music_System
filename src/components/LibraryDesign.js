import React, { useState } from 'react';
import './LibraryDesign.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Point 3: Mock song data
const mockSongs = [
  {
    id: 1,
    name: "Everyday",
    artist: "Ariana Grande",
    image: "https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900",
    src: "https://p.scdn.co/mp3-preview/5c00aeb796dc03f5abcc276ad7a0a7f7c1b4f01b?cid=774b29d4f13844c495f206cafdad9c86"
  },
  {
    id: 2,
    name: "Moonlight",
    artist: "Kali Uchis",
    image: "https://media.pitchfork.com/photos/64010158a7f139f6f3633630/1:1/w_3000,h_3000,c_limit/Kali-Uchis-Red-Moon-in-Venus.jpg",
    src: "https://p.scdn.co/mp3-preview/38313055755138116f1769d3ee32c011e8f23f53?cid=774b29d4f13844c495f206cafdad9c86"
  },
  {
    id: 3,
    name: "Nights",
    artist: "Frank Ocean",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg",
    src: "https://p.scdn.co/mp3-preview/e5e26bda7988f02462a6f7652750e6088d1f8f53?cid=774b29d4f13844c495f206cafdad9c86"
  }
];

// Point 3: Accept setCurrentSong
export default function LibraryDesign({ prop = { playlistTitle: "My Playlist", gridTitle: "Liked Songs" }, setIsAudioBarVisible, setCurrentSong }) {
  
  const [likedSongs, setLikedSongs] = useState({});

  const handleLike = (e, songId) => {
    e.stopPropagation(); 
    setLikedSongs(prev => ({
      ...prev,
      [songId]: !prev[songId] 
    }));
  };

  // Point 3: Update handleSongClick
  const handleSongClick = (song) => {
    if (setIsAudioBarVisible) {
      setIsAudioBarVisible(true);
    }
    setCurrentSong(song); // Set the clicked song as the current song
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
            {/* Point 3: Use mock data */}
            {mockSongs.concat(mockSongs).concat(mockSongs).map((song, i) => ( // Repeat mock data
              <div className="song-row" key={i} onClick={() => handleSongClick(song)}>
                <img src={song.image} alt="Song_poster" />
                <div>{song.name} <span>{song.artist}</span></div>
                
                <div className={`heart-icon ${likedSongs[song.id] ? 'liked' : ''}`} onClick={(e) => handleLike(e, song.id)}>
                  {likedSongs[song.id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </div>

              </div>
            ))}
          </div>
        </div>

        <div className='grid-menus'>
          <div className='grid-menu-head'>{prop.gridTitle}</div>
          <div className='grid-menu-content'>
            {/* Point 3: Use mock data */}
            {mockSongs.concat(mockSongs).concat(mockSongs).map((song, i) => (
              <div className="menu-tile" key={i} onClick={() => handleSongClick(song)}>
                <img src={song.image} alt='Song_poster' />
                <div>{song.name} <span>{song.artist} </span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}