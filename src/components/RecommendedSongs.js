import React, { useState, useEffect } from 'react'
import SongGrid from './SongGrid'
import './RecommendedSongs.css'
import mlApi, { normalizeSongData } from '../apiMl'; // Import ML API

export default function RecommendedSongs({ setIsAudioBarVisible, setCurrentSong, token }) {
  const [songs, setSongs] = useState([]);
  
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        // Use the /popular endpoint from the ML API
        const response = await mlApi.get('/popular?limit=10');
        const normalized = response.data.map(normalizeSongData);
        setSongs(normalized);
      } catch (err) {
        console.error("Failed to fetch popular songs", err);
      }
    };
    fetchPopular();
  }, []); // Run once on component mount

  return (
    <div className='recommended-songs'>
        <div>
            <SongGrid 
              prop="Recommended" 
              setIsAudioBarVisible={setIsAudioBarVisible} 
              setCurrentSong={setCurrentSong}
              token={token}
              songs={songs} // Pass fetched songs to grid
            />
        </div>
    </div>
  )
}