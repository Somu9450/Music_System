import React from 'react'
import SongGrid from './SongGrid'
import './RecentlyPlayed.css'

// Point 7: Accept and pass prop
export default function RecentlyPlayed({ setIsAudioBarVisible }) {
  return (
    <div className='recently-played'>
            
            <div>
                <SongGrid prop="Recently Played" setIsAudioBarVisible={setIsAudioBarVisible} />
            </div>
        </div>
  )
}