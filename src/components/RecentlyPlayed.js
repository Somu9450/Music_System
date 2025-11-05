import React, { useState, useEffect } from 'react'
import SongGrid from './SongGrid'
import './RecentlyPlayed.css'
import HistoryIcon from '@mui/icons-material/History';
import api from '../api'; 
// import { normalizeSongData } from '../apiMl'; // Not needed here

export default function RecentlyPlayed({ setIsAudioBarVisible, setCurrentSong, token }) {
  const [recentSongs, setRecentSongs] = useState([]);

  useEffect(() => {
    const fetchRecent = async () => {
      if (!token) {
        setRecentSongs([]); 
        return;
      }
      try {
        const response = await api.get('/api/recent/');
        
        // Check if response.data.songs exists, otherwise assume response.data is the array
        const songsFromDb = Array.isArray(response.data.songs) ? response.data.songs : 
                            Array.isArray(response.data) ? response.data : [];

        // --- THIS NORMALIZATION IS NOW FIXED ---
        const normalized = songsFromDb.map(song => ({
          // Use the keys from the backend 'RecentlyPlayed' model
          id: song.track_id || song._id, 
          _id: song._id,
          name: song.track_name,   // ✅ Was 'name'
          artist: song.artists,    // ✅ Was 'artist'
          image: song.img,         // ✅ Was 'image'
          src: song.src
        })); // .reverse() was removed here

        setRecentSongs(normalized || []);
      } catch (err) {
        console.error("Failed to fetch recent songs", err);
        setRecentSongs([]); 
      }
    };

    fetchRecent();
  }, [token]); 

  return (
    <div className='recently-played'>
      <div>
        <SongGrid 
          prop="Recently Played" 
          setIsAudioBarVisible={setIsAudioBarVisible} 
          showSeeAll={false} 
          setCurrentSong={setCurrentSong}
          token={token}
          songs={recentSongs} 
        />
      </div>
    </div>
  )
}