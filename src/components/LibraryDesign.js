import React, { useState, useEffect } from 'react';
import './LibraryDesign.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import api from '../api'; // Auth backend API
import mlApi, { normalizeSongData } from '../apiMl'; // ML backend API

// Hardcoded artist list (to match ArtistGrid.js)
const allArtists = ['Drake', 'Taylor Swift', 'Ariana Grande', 'The Weeknd', 'Billie Eilish', 'Bad Bunny'];

export default function LibraryDesign({ 
  token, 
  setCurrentSong, 
  setIsAudioBarVisible, 
  libraryView, 
  setLibraryView 
}) {
  
  const [playlistTitle, setPlaylistTitle] = useState("Liked Songs");
  const [playlistContent, setPlaylistContent] = useState([]);
  const [gridTitle, setGridTitle] = useState("Recommended");
  const [gridContent, setGridContent] = useState([]);

  const [likedSongsMap, setLikedSongsMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Helper to fetch liked songs status
  const fetchLikedStatus = async () => {
    if (!token) {
      setLikedSongsMap({});
      return {};
    }
    try {
      const response = await api.get('/api/liked/');
      const songsFromDb = response.data.songs || [];
      const likeMap = songsFromDb.reduce((acc, song) => {
        acc[song.track_id || song._id] = true;
        return acc;
      }, {});
      setLikedSongsMap(likeMap);
      return likeMap;
    } catch (err) {
      console.error("Failed to fetch liked songs status", err);
      return {};
    }
  };

  // Main data fetching logic based on libraryView
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchLikedStatus(); // Always refresh like status

      if (libraryView.type === 'liked') {
        setPlaylistTitle("Liked Songs");
        setGridTitle("Recommended For You");
        
        // Fetch liked songs from Auth API
        if (!token) {
          setPlaylistContent([]);
          setGridContent([]);
          setIsLoading(false);
          return;
        }
        try {
          const response = await api.get('/api/liked/');
          const likedSongs = (response.data.songs || []).map(song => ({
            ...normalizeSongData(song),
            id: song.track_id || song._id, // Ensure frontend ID is track_id
          }));
          setPlaylistContent(likedSongs);

          // Fetch recommendations based on first liked song
          if (likedSongs.length > 0) {
            const recResponse = await mlApi.get(`/recommend/${likedSongs[0].id}?limit=10`);
            // recommendations are in { similar_songs: [], popular_in_genre: [] }
            const recs = recResponse.data.similar_songs.map(normalizeSongData);
            setGridContent(recs.map(song => ({ type: 'song', data: song })));
          } else {
            setGridContent([]);
          }
        } catch (err) {
          console.error("Failed to fetch liked songs or recommendations", err);
        }

      } else if (libraryView.type === 'genre') {
        setPlaylistTitle(libraryView.value);
        setGridTitle("Other Genres");

        // Fetch songs for this genre
        try {
          const songsResponse = await mlApi.get(`/songs_by_genre?genre=${libraryView.value}`);
          setPlaylistContent(songsResponse.data.map(normalizeSongData));

          // Fetch all genres for grid
          const genresResponse = await mlApi.get('/genres');
          const otherGenres = genresResponse.data.filter(g => g.toLowerCase() !== libraryView.value.toLowerCase());
          setGridContent(otherGenres.map(g => ({ type: 'genre', name: g })));
        } catch (err) {
          console.error("Failed to fetch genre data", err);
        }

      } else if (libraryView.type === 'artist') {
        setPlaylistTitle(libraryView.value);
        setGridTitle("Other Artists");

        // Fetch songs for this artist
        try {
          const songsResponse = await mlApi.get(`/search?query=${libraryView.value}`);
          setPlaylistContent(songsResponse.data.map(normalizeSongData));

          // Fetch artist images for grid
          const otherArtists = allArtists.filter(a => a.toLowerCase() !== libraryView.value.toLowerCase());
          const artistPromises = otherArtists.map(name => mlApi.get(`/search?query=${name}&limit=1`));
          const results = await Promise.all(artistPromises);
          const artistData = results.map((res, index) => ({
            type: 'artist',
            name: otherArtists[index],
            image: res.data[0]?.img || "default-image-url.png" // Fallback image
          }));
          setGridContent(artistData);
        } catch (err) {
          console.error("Failed to fetch artist data", err);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [libraryView, token]); // Rerun when view or token changes

  // Like/Unlike handler
  const handleLike = async (e, song) => {
    e.stopPropagation();
    if (!token) {
      alert("Please log in to like songs");
      return;
    }
    const trackId = song.id; 
    const isLiked = !!likedSongsMap[trackId];

    try {
      if (isLiked) {
        // Find the full mongoId from the auth backend to delete
        // This is a limitation: we MUST fetch liked songs first to get the _id
        const likedResponse = await api.get('/api/liked/');
        const songToUnlike = likedResponse.data.songs.find(s => (s.track_id || s._id) === trackId);
        if (songToUnlike) {
          await api.delete(`/api/liked/${songToUnlike._id}`);
        }
      } else {
        await api.post('/api/liked/add', { 
          songId: trackId, // Send track_id
          ...song // Send all song data
        });
      }
      
      // Optimistically update UI
      setLikedSongsMap(prev => ({ ...prev, [trackId]: !isLiked }));

      // If we are on the 'liked' page, refresh the list
      if (libraryView.type === 'liked') {
        const response = await api.get('/api/liked/');
        const likedSongs = (response.data.songs || []).map(song => ({
          ...normalizeSongData(song),
          id: song.track_id || song._id,
        }));
        setPlaylistContent(likedSongs);
      }

    } catch (err) {
      console.error("Like error:", err);
      alert("Failed to update liked songs.");
    }
  };

  // Song click handler
  const handleSongClick = (song) => {
    // Point 1: Check for login
    if (!token) {
      alert("Please login to play music.");
      return;
    }
    if (setIsAudioBarVisible) {
      setIsAudioBarVisible(true);
    }
    setCurrentSong(song);
    // Add to recent
    if (token) {
      api.post('/api/recent/add', { songId: song.id, ...song }).catch(err => console.warn("Failed to add to recent", err));
    }
  };

  // Grid click handler
  const handleGridClick = (item) => {
    if (item.type === 'song') {
      handleSongClick(item.data);
    } else if (item.type === 'genre') {
      setLibraryView({ type: 'genre', value: item.name });
    } else if (item.type === 'artist') {
      setLibraryView({ type: 'artist', value: item.name });
    }
  };
  
  // Helper to render the grid content
  const renderGridItem = (item) => {
    switch (item.type) {
      case 'song':
        return (
          <div className="menu-tile" key={item.data.id} onClick={() => handleGridClick(item)}>
            <img src={item.data.image} alt={item.data.name} />
            <div>{item.data.name} <span>{item.data.artist} </span></div>
          </div>
        );
      case 'genre':
        return (
          <div className="genre-tile-library" key={item.name} onClick={() => handleGridClick(item)}>
            {item.name}
          </div>
        );
      case 'artist':
        return (
          <div className="artist-tile-library" key={item.name} onClick={() => handleGridClick(item)}>
            <img src={item.image} alt={item.name} />
            <span>{item.name}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='page-container'>
      <div className='page-head'>
        <h1>My Library</h1>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className='playlist-grid'>
          <div className='playlist'>
            <div className='playlist-head'>{playlistTitle}</div>
            <div className='playlist-content'>
              {playlistContent.length > 0 ? playlistContent.map((song) => (
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
                <p style={{padding: '20px', color: '#aaa'}}>No songs found.</p>
              )}
            </div>
          </div>

          <div className='grid-menus'>
            <div className='grid-menu-head'>{gridTitle}</div>
            <div className='grid-menu-content'>
              {gridContent.length > 0 ? gridContent.map(renderGridItem) : (
                <p style={{padding: '20px', color: '#aaa'}}>Nothing to show.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}