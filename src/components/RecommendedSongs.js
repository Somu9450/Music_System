import React from 'react'
import SongGrid from './SongGrid'
import './RecommendedSongs.css'

// Point 3: Pass setCurrentSong
export default function RecommendedSongs({ setIsAudioBarVisible, setCurrentSong }) {
  return (
    <div className='recommended-songs'>
        
        <div>
            <SongGrid 
              prop="Recommended" 
              setIsAudioBarVisible={setIsAudioBarVisible} 
              setCurrentSong={setCurrentSong}
            />
        </div>
    </div>
  )
}