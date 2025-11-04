import React, { useState, useEffect } from 'react'
import SongGrid from './SongGrid'
import './RecentlyPlayed.css'
import api from '../api'; 
import { normalizeSongData } from '../apiMl'; // Import the normalizer

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
        // Normalize the data from the Auth backend
        const normalized = response.data.songs.map(song => ({
          id: song.track_id || song._id, // Prefer track_id
          _id: song._id,
          name: song.name,
          artist: song.artist,
          image: song.image,
          src: song.src
        }));
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