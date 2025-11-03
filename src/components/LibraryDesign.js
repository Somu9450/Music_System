import React, { useState, useEffect } from 'react';
import './LibraryDesign.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import api from '../api'; // Import api

// Accept setCurrentSong and token
export default function LibraryDesign({ prop = { playlistTitle: "My Playlist", gridTitle: "Liked Songs" }, setIsAudioBarVisible, setCurrentSong, token }) {
  
  const [likedSongsMap, setLikedSongsMap] = useState({}); // Stores liked status by ID
  const [songList, setSongList] = useState([]); // Stores song objects for "My Playlist"
  const [likedSongsList, setLikedSongsList] = useState([]); // Stores song objects for "Liked Songs"

  // Fetch Liked Songs
  const fetchLikedSongs = async () => {
    if (!token) {
      setLikedSongsMap({});
      setLikedSongsList([]);
      return;
    }
    try {
      const response = await api.get('/api/liked/');
      const songs = response.data.songs || []; // Assuming API returns { songs: [...] }
      
      // Create a map for quick like-status lookup
      const likeMap = songs.reduce((acc, song) => {
        acc[song.id] = true;
        return acc;
      }, {});
      
      setLikedSongsList(songs);
      setLikedSongsMap(likeMap);
    } catch (err) {
      console.error("Failed to fetch liked songs", err);
    }
  };

  // Fetch playlist songs (using liked songs as placeholder for "My Playlist" for now)
  const fetchPlaylistSongs = () => {
    // In a real app, you'd fetch a specific playlist
    // For now, let's just use the liked songs list
    setSongList(likedSongsList);
  };
  
  useEffect(() => {
    fetchLikedSongs();
  }, [token]);

  useEffect(() => {
    // Update playlist when liked songs list changes
    fetchPlaylistSongs();
  }, [likedSongsList]);


  const handleLike = async (e, song) => {
    e.stopPropagation();
    if (!token) {
      alert("Please log in to like songs");
      return;
    }

    const songId = song.id;
    const isLiked = !!likedSongsMap[songId];

    try {
      if (isLiked) {
        // UNLIKE: Call Delete API
        await api.delete(`/api/liked/${songId}`);
      } else {
        // LIKE: Call Add API
        await api.post('/api/liked/add', { songId: songId });
      }
      
      // Optimistically update UI
      const newLikedMap = { ...likedSongsMap };
      if (isLiked) {
        delete newLikedMap[songId];
      } else {
        newLikedMap[songId] = true;
      }
      setLikedSongsMap(newLikedMap);

      // Refetch liked songs list to keep UI in sync
      fetchLikedSongs();

    } catch (err) {
      console.error("Like error:", err);
      alert("Failed to update liked songs.");
    }
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

  const handleSongClick = (song) => {
    if (setIsAudioBarVisible) {
      setIsAudioBarVisible(true);
    }
    setCurrentSong(song);
    handleRecentApiCall(song.id);
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
                <img src={song.image} alt="Song_poster" />
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
                <img src={song.image} alt='Song_poster' />
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