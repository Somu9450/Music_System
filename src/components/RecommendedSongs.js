import React from 'react'
import SongGrid from './SongGrid'
import './RecommendedSongs.css'

// Point 7: Accept and pass prop
export default function RecommendedSongs({ setIsAudioBarVisible }) {
  return (
    <div className='recommended-songs'>
        
        <div>
            <SongGrid prop="Recommended" setIsAudioBarVisible={setIsAudioBarVisible} />
        </div>
    </div>
  )
}