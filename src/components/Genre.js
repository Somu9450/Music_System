import React, { useState, useEffect } from 'react'
import SongGrid from './SongGrid'
import './Genre.css'
import mlApi, { normalizeSongData } from '../apiMl'; // Import ML API

export default function Genre({ setIsAudioBarVisible, setCurrentSong, token }) {
  const [songs, setSongs] = useState([]);
  
  useEffect(() => {
    const fetchGenre = async () => {
      try {
        // Use the /songs_by_genre endpoint
        const response = await mlApi.get('/songs_by_genre', {
          params: { genre: 'pop', limit: 10 } // Hardcoding 'pop' for this grid
        });
        const normalized = response.data.map(normalizeSongData);
        setSongs(normalized);
      } catch (err) {
        console.error("Failed to fetch genre songs", err);
      }
    };
    fetchGenre();
  }, []); // Run once

  return (
    <div className='genre'>
        <div>
            <SongGrid 
              prop="Genre" 
              setIsAudioBarVisible={setIsAudioBarVisible} 
              showSeeAll={false} 
              setCurrentSong={setCurrentSong}
              token={token}
              songs={songs} // Pass fetched songs
            />
        </div>
    </div>
  )
}