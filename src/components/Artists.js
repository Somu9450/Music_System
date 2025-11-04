import React, { useState, useEffect } from 'react'
import SongGrid from './SongGrid'
import './Artists.css'
import mlApi, { normalizeSongData } from '../apiMl'; // Import ML API

export default function Artists({ setIsAudioBarVisible, setCurrentSong, token }) {
  const [songs, setSongs] = useState([]);
  
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Using 'hip-hop' to get different songs
        const response = await mlApi.get('/songs_by_genre', {
          params: { genre: 'hip-hop', limit: 10 } 
        });
        const normalized = response.data.map(normalizeSongData);
        setSongs(normalized);
      } catch (err) {
        console.error("Failed to fetch hip-hop songs", err);
      }
    };
    fetchSongs();
  }, []);

  return (
    <div className='artists'>
        <div>
            <SongGrid 
              prop="Artists" 
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