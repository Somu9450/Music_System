import React, { useState, useEffect } from 'react';
import './LibraryDesign.css'; // Keep this for container styles
import LibraryPlaylist from './LibraryPlaylist'; // Import new component
import LibraryGridMenu from './LibraryGridMenu'; // Import new component
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

  // Main data fetching logic (this stays here, as this is the "container")
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
  
  // All the rendering logic is removed from here
  // and replaced with the new components.
  return (
    <div className='page-container'>
      <div className='page-head'>
        <h1>My Library</h1>
      </div>

      <div className='playlist-grid'>
        {/* Use the new Playlist component */}
        <LibraryPlaylist
          title={playlistTitle}
          songs={playlistContent}
          isLoading={isLoading}
          handleSongClick={handleSongClick}
          likedSongsMap={likedSongsMap}
          handleLikeToggle={handleLikeToggle}
        />
        
        {/* Use the new GridMenu component */}
        <LibraryGridMenu
          title={gridTitle}
          items={gridContent}
          isLoading={isLoading}
          handleGridClick={handleGridClick}
        />
      </div>
    </div>
  );
}