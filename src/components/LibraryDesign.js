import React, { useState, useEffect } from 'react';
import './LibraryDesign.css'; // Keep this for container styles
import LibraryPlaylist from './LibraryPlaylist'; // Import new component
import LibraryGridMenu from './LibraryGridMenu'; // Import new component
import api from '../api'; // Auth backend API
import mlApi, { normalizeSongData, normalizeArtistData } from '../apiMl'; // ML backend API

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

  // New state to hold our dynamic artist list
  const [allArtists, setAllArtists] = useState([]);

  // Fetch all artists once when the component loads
  useEffect(() => {
    const fetchAllArtists = async () => {
      // Fetch a list of 20 artists to use in the grid menus
      const artistList = await normalizeArtistData(20);
      setAllArtists(artistList);
    };
    fetchAllArtists();
  }, []);

  // Main data fetching logic
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Utility function to get 10 random artists, excluding a specific one
      const getOtherArtists = (excludeName = null) => {
        const otherArtists = allArtists.filter(
          a => a.name.toLowerCase() !== excludeName?.toLowerCase()
        );
        // Simple shuffle and take 10
        return otherArtists.sort(() => 0.5 - Math.random()).slice(0, 10);
      };

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
          const songsResponse = await mlApi.get(`/songs_by_genre?genre=${libraryView.value}&limit=50`);
          setPlaylistContent(songsResponse.data.map(normalizeSongData));

          const genresResponse = await mlApi.get('/genres');
          const otherGenres = genresResponse.data.filter(g => g.toLowerCase() !== libraryView.value.toLowerCase());
          setGridContent(otherGenres.map(g => ({ type: 'genre', name: g })));
        } catch (err) {
          console.error("Failed to fetch genre data", err);
        }

      } else if (libraryView.type === 'artist') {
        const artistName = libraryView.value;
        setPlaylistTitle(artistName);
        setGridTitle("Other Artists");

        try {
          // Fetch all songs for this artist by search
          const songsResponse = await mlApi.get(`/search?query=${artistName}&limit=50`);
          // Filter songs to match the artist name exactly
          const artistSongs = songsResponse.data
            .map(normalizeSongData)
            .filter(song => song.artist.toLowerCase() === artistName.toLowerCase());

          setPlaylistContent(artistSongs);

          // Set grid content to 10 other artists
          setGridContent(getOtherArtists(artistName));

        } catch (err) {
          console.error("Failed to fetch artist data", err);
        }
      
      } else if (libraryView.type === 'recommended') {
        setPlaylistTitle("Recommended Songs");
        setGridTitle("All Artists"); // As requested

        try {
          const songsResponse = await mlApi.get('/popular?limit=50');
          setPlaylistContent(songsResponse.data.map(normalizeSongData));

          // Use the dynamic artist list
          setGridContent(allArtists.slice(0, 10)); // Show first 10
          
        } catch (err) {
          console.error("Failed to fetch recommended/artist data", err);
        }
      
      // New view for "See All" artists
      } else if (libraryView.type === 'artists_all') {
        setPlaylistTitle("All Artists");
        setPlaylistContent([]); // No songs selected yet
        setGridTitle("All Artists");
        // Show the first 10 artists from our fetched list
        setGridContent(allArtists.slice(0, 10));
      }

      setIsLoading(false);
    };

    // Only run fetch logic if we have artists to display (for artist-related views)
    if (allArtists.length > 0 || (libraryView.type !== 'artist' && libraryView.type !== 'artists_all' && libraryView.type !== 'recommended')) {
      fetchData();
    }
  }, [libraryView, token, allArtists]); // Rerun when view, token, or artist list changes

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
      api.post('/api/recent/add', { 
          songId: song.id, // The ID to find/create by
          track_id: song.id,
          track_name: song.name,
          artists: song.artist,
          album_name: song.album_name,
          img: song.image,
          src: song.src
        }).catch(err => console.warn("Failed to add to recent", err));
    }
  };

  // Grid click handler
  const handleGridClick = (item) => {
    if (item.type === 'song') {
      handleSongClick(item.data);
    } else if (item.type === 'genre') {
      setLibraryView({ type: 'genre', value: item.name });
    } else if (item.type === 'artist' || item.type === 'artist_name_only') {
      // This click now triggers the "reshuffle" by updating the view
      setLibraryView({ type: 'artist', value: item.name });
    }
  };
  
  return (
    <div className='page-container'>
      <div className='page-head'>
        <h1>My Library</h1>
      </div>

      <div className='playlist-grid'>
        <LibraryPlaylist
          title={playlistTitle}
          songs={playlistContent}
          isLoading={isLoading}
          handleSongClick={handleSongClick}
          likedSongsMap={likedSongsMap}
          handleLikeToggle={handleLikeToggle}
          // Pass a message if no artist is selected
          customEmptyMessage={
            libraryView.type === 'artists_all' ? 'Select an artist to see their songs.' : 'No songs found.'
          }
        />
        
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