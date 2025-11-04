import React, { useState, useEffect } from 'react'
import SongGrid from './SongGrid'
import './RecommendedSongs.css'
import mlApi, { normalizeSongData } from '../apiMl'; 

export default function RecommendedSongs({ 
  setIsAudioBarVisible, 
  setCurrentSong, 
  token,
  setLibraryView, // New prop
  setCurrentPage // New prop
}) {
  const [songs, setSongs] = useState([]);
  
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await mlApi.get('/popular?limit=10');
        const normalized = response.data.map(normalizeSongData);
        setSongs(normalized);
      } catch (err) {
        console.error("Failed to fetch popular songs", err);
      }
    };
    fetchPopular();
  }, []); 

  // Handler for "See All"
  const handleSeeAllClick = () => {
    setLibraryView({ type: 'recommended' });
    setCurrentPage('library');
  };

  return (
    <div className='recommended-songs'>
        <div>
            <SongGrid 
              prop="Recommended" 
              setIsAudioBarVisible={setIsAudioBarVisible} 
              setCurrentSong={setCurrentSong}
              token={token}
              songs={songs} 
              showSeeAll={true} // Explicitly show
              onSeeAllClick={handleSeeAllClick} // Pass the handler
            />
        </div>
    </div>
  )
}