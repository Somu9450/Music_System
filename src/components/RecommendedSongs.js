import React from 'react'
import SongGrid from './SongGrid'
import './RecommendedSongs.css'

export default function RecommendedSongs({ setIsAudioBarVisible, setCurrentSong, token }) {
  return (
    <div className='recommended-songs'>
        
        <div>
            <SongGrid 
              prop="Recommended" 
              setIsAudioBarVisible={setIsAudioBarVisible} 
              setCurrentSong={setCurrentSong}
              token={token}
            />
        </div>
    </div>
  )
}