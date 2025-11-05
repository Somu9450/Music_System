import React, { useState, useEffect } from 'react'
import SongGrid from './SongGrid'
import './RecentlyPlayed.css'
import api from '../api'; 
// import { normalizeSongData } from '../apiMl'; // Not needed if we normalize here

// Accept token
export default function RecentlyPlayed({ setIsAudioBarVisible, setCurrentSong, token }) {
  const [recentSongs, setRecentSongs] = useState([]);

  useEffect(() => {
    const fetchRecent = async () => {
      if (!token) {
        setRecentSongs([]); // Clear songs if logged out
        return;
      }
      try {
        const response = await api.get('/api/recent/');
        
        // --- FIX: NORMALIZE DATA FROM AUTH BACKEND ---
        // The backend GET /api/recent/ returns songs added by POST /api/recent/add
        // We must use the keys from the POST: (track_name, artists, img)
        
        // Check if response.data.songs exists, otherwise assume response.data is the array
        const songsFromDb = Array.isArray(response.data.songs) ? response.data.songs : 
                            Array.isArray(response.data) ? response.data : [];

        const normalized = songsFromDb.map(song => ({
          id: song.track_id || song._id, // Use track_id
          _id: song._id,
          name: song.track_name || song.name, // <-- FIX: Use track_name
          artist: song.artists || song.artist, // <-- FIX: Use artists
          image: song.img || song.image, // <-- FIX: Use img
          src: song.src
        }))
        // The user wants a "stack" (latest first).
        // This should ideally be done by the backend.
        // If not, we can reverse it here in the frontend.
        .reverse(); // <-- This makes it "latest first"

        setRecentSongs(normalized || []);
      } catch (err) {
        console.error("Failed to fetch recent songs", err);
        setRecentSongs([]); // Clear on error
      }
    };

    fetchRecent();
  }, [token]); // Refetch when token changes

  return (
    <div className='recently-played'>
      <div>
        <SongGrid 
          prop="Recently Played" 
          setIsAudioBarVisible={setIsAudioBarVisible} 
          showSeeAll={false} 
          setCurrentSong={setCurrentSong}
          token={token}
          songs={recentSongs} // Pass fetched songs to SongGrid
        />
      </div>
    </div>
  )
}