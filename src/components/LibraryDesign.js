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
  setLibraryView,
  likedSongsMap, // Point 1: Receive from props
  handleLikeToggle // Point 1: Receive from props
}) {
  
  const [playlistTitle, setPlaylistTitle] = useState("Liked Songs");
  const [playlistContent, setPlaylistContent] = useState([]);
  const [gridTitle, setGridTitle] = useState("Recommended");
  const [gridContent, setGridContent] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // Main data fetching logic based on libraryView
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      if (libraryView.type === 'liked') {
        setPlaylistTitle("Liked Songs");
        setGridTitle("Recommended For You");
        
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
            id: song.track_id || song._id, 
          }));
          setPlaylistContent(likedSongs);

          // Fetch recommendations based on first liked song
          if (likedSongs.length > 0) {
            const recResponse = await mlApi.get(`/recommend/${likedSongs[0].id}?limit=10`);
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

        try {
          // Point 3 & 5: Fetch ALL songs for this genre
          const songsResponse = await mlApi.get(`/songs_by_genre?genre=${libraryView.value}&limit=50`);
          setPlaylistContent(songsResponse.data.map(normalizeSongData));

          const genresResponse = await mlApi.get('/genres');
          const otherGenres = genresResponse.data.filter(g => g.toLowerCase() !== libraryView.value.toLowerCase());
          setGridContent(otherGenres.map(g => ({ type: 'genre', name: g })));
        } catch (err) {
          console.error("Failed to fetch genre data", err);
        }

      } else if (libraryView.type === 'artist') {
        setPlaylistTitle(libraryView.value);
        setGridTitle("Other Artists");

        try {
          // Point 3 & 4: Fetch ALL songs for this artist by search
          const songsResponse = await mlApi.get(`/search?query=${libraryView.value}&limit=50`);
          setPlaylistContent(songsResponse.data.map(normalizeSongData));

          const otherArtists = allArtists.filter(a => a.toLowerCase() !== libraryView.value.toLowerCase());
          const artistPromises = otherArtists.map(name => mlApi.get(`/search?query=${name}&limit=1`));
          const results = await Promise.all(artistPromises);
          const artistData = results.map((res, index) => ({
            type: 'artist',
            name: otherArtists[index],
            image: res.data[0]?.img || "default-image-url.png" 
          }));
          setGridContent(artistData);
        } catch (err) {
          console.error("Failed to fetch artist data", err);
        }
      
      // New 'recommended' view
      } else if (libraryView.type === 'recommended') {
        setPlaylistTitle("Recommended Songs");
        setGridTitle("All Artists"); // As requested

        try {
          // Fetch all popular songs
          const songsResponse = await mlApi.get('/popular?limit=50');
          setPlaylistContent(songsResponse.data.map(normalizeSongData));

          // Fetch artist names for grid
          // Using hardcoded list as API doesn't have a /artists endpoint
          setGridContent(allArtists.map(a => ({ type: 'artist_name_only', name: a })));
          
        } catch (err) {
          console.error("Failed to fetch recommended/artist data", err);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [libraryView, token]); // Rerun when view or token changes

  // Song click handler
  const handleSongClick = (song) => {
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
    } else if (item.type === 'artist' || item.type === 'artist_name_only') {
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
      // New grid item for "artist name only"
      case 'artist_name_only':
        return (
          <div className="genre-tile-library" key={item.name} onClick={() => handleGridClick(item)}>
            {item.name}
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
                  
                  {/* Point 1: Use global like state and handler */}
                  <div 
                    className={`heart-icon ${likedSongsMap[song.id] ? 'liked' : ''}`} 
                    onClick={(e) => handleLikeToggle(song, e)}
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