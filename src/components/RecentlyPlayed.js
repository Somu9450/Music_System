import React from 'react'
import SongGrid from './SongGrid'
import './RecentlyPlayed.css'

// Point 3: Pass setCurrentSong
export default function RecentlyPlayed({ setIsAudioBarVisible, setCurrentSong }) {
  return (
    <div className='recently-played'>
            
            <div>
                <SongGrid 
                  prop="Recently Played" 
                  setIsAudioBarVisible={setIsAudioBarVisible} 
                  showSeeAll={false} 
                  setCurrentSong={setCurrentSong}
                />
            </div>
        </div>
  )
}