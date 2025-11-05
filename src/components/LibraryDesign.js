import React, { useState, useEffect } from 'react';
import './LibraryDesign.css'; 
import LibraryPlaylist from './LibraryPlaylist'; 
import LibraryGridMenu from './LibraryGridMenu'; 
import api from '../api'; 
import mlApi, { getSongData, getArtistData } from '../apiMl'; // Import updated normalizer

export default function LibraryDesign({ 
  token, 
  setCurrentSong, 
  setIsAudioBarVisible, 
  libraryView, 
  setLibraryView,
  likedSongsMap, 
  handleLikeToggle 
}) {
  
  const [playlistTitle, setPlaylistTitle] = useState("Liked Songs");
  const [playlistContent, setPlaylistContent] = useState([]);
  const [gridTitle, setGridTitle] = useState("Recommended");
  const [gridContent, setGridContent] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [allArtists, setAllArtists] = useState([]);

  useEffect(() => {
    const fetchAllArtists = async () => {
      const artistList = await getArtistData(20);
      setAllArtists(artistList);
    };
    fetchAllArtists();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const getOtherArtists = (excludeName = null) => {
        const otherArtists = allArtists.filter(
          a => a.name.toLowerCase() !== excludeName?.toLowerCase()
        );
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
          // --- FIX 1: 'GET /api/liked/' returns an array directly ---
          const response = await api.get('/api/liked/');
          
          // Use response.data, not response.data.songs
          // Also, use the master getSongData function
          const likedSongs = (response.data || []).map(getSongData);
          
          setPlaylistContent(likedSongs);

          // const recResponse = await mlApi.get(`/recommend/${likedSongs[0].id}?limit=10`);
          //   const recs = recResponse.data.similar_songs.map(getSongData);
          //   setGridContent(recs.map(song => ({ type: 'song', data: song })));

            
          // Fetch popular songs (same as home page) instead of liked-based recommendations
           const popularResponse = await mlApi.get('/popular?limit=30');
           const popularSongs = popularResponse.data.map(getSongData);
           setGridContent(popularSongs.map(song => ({ type: 'song', data: song })));
        } catch (err) {
          console.error("Failed to fetch liked songs or recommendations", err);
        }

      } else if (libraryView.type === 'genre') {
        // ... (no changes in this block)
        setPlaylistTitle(libraryView.value);
        setGridTitle("Other Genres");
        try {
          const songsResponse = await mlApi.get(`/songs_by_genre?genre=${libraryView.value}&limit=100`);
          setPlaylistContent(songsResponse.data.map(getSongData));
          const genresResponse = await mlApi.get('/genres');
          const otherGenres = genresResponse.data.filter(g => g.toLowerCase() !== libraryView.value.toLowerCase());
          setGridContent(otherGenres.map(g => ({ type: 'genre', name: g })));
        } catch (err) {
          console.error("Failed to fetch genre data", err);
        }

      } else if (libraryView.type === 'artist') {
        // ... (no changes in this block)
        const artistName = libraryView.value;
        setPlaylistTitle(artistName);
        setGridTitle("Other Artists");
        try {
          const songsResponse = await mlApi.get(`/search?query=${artistName}&limit=100`);
          const artistSongs = songsResponse.data
            .map(getSongData)
            .filter(song => song.artist.toLowerCase() === artistName.toLowerCase());
          setPlaylistContent(artistSongs);
          setGridContent(getOtherArtists(artistName));
        } catch (err) {
          console.error("Failed to fetch artist data", err);
        }
      
      } else if (libraryView.type === 'recommended') {
        // ... (no changes in this block)
        setPlaylistTitle("Recommended Songs");
        setGridTitle("All Artists"); 
        try {
          const songsResponse = await mlApi.get('/popular?limit=50');
          setPlaylistContent(songsResponse.data.map(getSongData));
          setGridContent(allArtists.slice(0, 50)); 
        } catch (err) {
          console.error("Failed to fetch recommended/artist data", err);
        }
      
      } else if (libraryView.type === 'artists_all') {
        // ... (no changes in this block)
        setPlaylistTitle("All Artists");
        setPlaylistContent([]); 
        setGridTitle("All Artists");
        setGridContent(allArtists.slice(0, 50));
      }

      setIsLoading(false);
    };

    if (allArtists.length > 0 || (libraryView.type !== 'artist' && libraryView.type !== 'artists_all' && libraryView.type !== 'recommended')) {
      fetchData();
    }
  }, [libraryView, token, allArtists]); 

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
    
    // --- FIX 2: Send correct keys to '/api/recent/add' ---
    if (token) {
      api.post('/api/recent/add', { 
          songId: song.id,
          title: song.name,
          artist: song.artist,
          album: song.album_name || '',
          coverImage: song.image,
          preview: song.src
        }).catch(err => console.warn("Failed to add to recent", err.response?.data?.message || err.message));
    }
  };

  // Grid click handler
  const handleGridClick = (item) => {
    if (item.type === 'song') {
      handleSongClick(item.data); // This now works
    } else if (item.type === 'genre') {
      setLibraryView({ type: 'genre', value: item.name });
    } else if (item.type === 'artist' || item.type === 'artist_name_only') {
      setLibraryView({ type: 'artist', value: item.name });
    }
  };
  
  return (
    <div className='page-container'>
      {/* <div className='page-head'>
        <h1>My Library</h1>
      </div> */}

      <div className='playlist-grid'>
        <LibraryPlaylist
          title={playlistTitle}
          songs={playlistContent}
          isLoading={isLoading}
          handleSongClick={handleSongClick}
          likedSongsMap={likedSongsMap}
          handleLikeToggle={handleLikeToggle}
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