import React, { useState, useEffect } from 'react';
import './LibraryDesign.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import api from '../api'; // Auth backend API
// We don't need mlApi here unless we are fetching recommendations

/*
  This component now relies entirely on your Auth Backend.
  The songs displayed here are ONLY the songs the user has
  liked or added to a playlist.
*/
export default function LibraryDesign({ 
  prop = { playlistTitle: "My Playlist", gridTitle: "Liked Songs" }, 
  setIsAudioBarVisible, 
  setCurrentSong, 
  token 
}) {
  
  const [likedSongsMap, setLikedSongsMap] = useState({}); // Stores liked status by *track_id*
  const [songList, setSongList] = useState([]); // Stores song objects for "My Playlist"
  const [likedSongsList, setLikedSongsList] = useState([]); // Stores song objects for "Liked Songs"
  
  // This state will store the mapping from ML track_id to backend _id
  const [songIdMap, setSongIdMap] = useState({});

  // Fetch Liked Songs from our Auth Backend
  const fetchLikedSongs = async () => {
    if (!token) {
      setLikedSongsMap({});
      setLikedSongsList([]);
      setSongIdMap({});
      return;
    }
    try {
      const response = await api.get('/api/liked/');
      const songsFromDb = response.data.songs || []; // These are songs from our Auth DB
      
      const newLikeMap = {};
      const newIdMap = {};
      
      // Normalize the data from the Auth DB
      const normalizedSongs = songsFromDb.map(song => {
        // Your Auth DB `Song` model *must* have a `track_id` field
        // that matches the ML API's `track_id` for this to work.
        const id = song.track_id || song._id; // Use track_id if present

        newIdMap[id] = song._id; 
        newLikeMap[id] = true;
        
        return {
          id: id, // Primary ID for the frontend
          _id: song._id, // Mongo ID for API calls
          name: song.name,
          artist: song.artist,
          image: song.image,
          src: song.src,
        };
      });
      
      setLikedSongsList(normalizedSongs);
      setLikedSongsMap(newLikeMap);
      setSongIdMap(newIdMap);
      
      // For now, "My Playlist" is the same as "Liked Songs"
      setSongList(normalizedSongs);
      
    } catch (err) {
      console.error("Failed to fetch liked songs", err);
    }
  };
  
  useEffect(() => {
    fetchLikedSongs();
  }, [token]);


  const handleLike = async (e, song) => {
    e.stopPropagation();
    if (!token) {
      alert("Please log in to like songs");
      return;
    }

    const trackId = song.id; 
    const mongoId = songIdMap[trackId]; // Find the Mongo _id
    
    const isLiked = !!likedSongsMap[trackId];

    try {
      if (isLiked && mongoId) {
        // --- UNLIKE ---
        // We have the mongoId, so we can delete it
        await api.delete(`/api/liked/${mongoId}`);
      } else if (!isLiked) {
        // --- LIKE ---
        // This song came from the ML API and doesn't exist in our
        // Auth backend's 'songs' collection yet.
        await api.post('/api/liked/add', { 
          songId: song.id, // This is the ML API's track_id
          // Send all data so the backend can create the song entry
          name: song.name,
          artist: song.artist,
          image: song.image,
          src: song.src,
          track_id: song.id // Explicitly send track_id
        });
      }
      
      // Refetch all liked songs to get the single source of truth
      fetchLikedSongs();

    } catch (err) {
      console.error("Like error:", err);
      alert("Failed to update liked songs. The backend may need to be updated to handle new song IDs.");
    }
  };

  const handleRecentApiCall = async (song) => {
    if (token) {
      try {
        await api.post('/api/recent/add', { 
          songId: song.id, // This is the ML API's track_id
          name: song.name,
          artist: song.artist,
          image: song.image,
          src: song.src,
          track_id: song.id
        });
      } catch (err) {
        console.warn(
          "Note: 'Add to Recent' API failed.",
          err.response?.data?.message
        );
      }
    }
  };

  const handleSongClick = (song) => {
    if (setIsAudioBarVisible) {
      setIsAudioBarVisible(true);
    }
    setCurrentSong(song);
    handleRecentApiCall(song); // Pass the whole song
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
            {songList.length > 0 ? songList.map((song) => (
              <div className="song-row" key={song.id} onClick={() => handleSongClick(song)}>
                <img src={song.image} alt={song.name} />
                <div>{song.name} <span>{song.artist}</span></div>
                
                <div 
                  className={`heart-icon ${likedSongsMap[song.id] ? 'liked' : ''}`} 
                  onClick={(e) => handleLike(e, song)}
                >
                  {likedSongsMap[song.id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </div>
              </div>
            )) : (
              <p style={{padding: '20px', color: '#aaa'}}>Your playlist is empty.</p>
            )}
          </div>
        </div>

        <div className='grid-menus'>
          <div className='grid-menu-head'>{prop.gridTitle}</div>
          <div className='grid-menu-content'>
            {likedSongsList.length > 0 ? likedSongsList.map((song) => (
              <div className="menu-tile" key={song.id} onClick={() => handleSongClick(song)}>
                <img src={song.image} alt={song.name} />
                <div>{song.name} <span>{song.artist} </span></div>
              </div>
            )) : (
              <p style={{padding: '20px', color: '#aaa'}}>You haven't liked any songs yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}