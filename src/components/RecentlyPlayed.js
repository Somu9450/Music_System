import React from 'react'
import SongGrid from './SongGrid'
import './RecentlyPlayed.css'

export default function RecentlyPlayed({ setIsAudioBarVisible }) {
  return (
    <div className='recently-played'>
            
            <div>
                {/* Point 2: Added showSeeAll={false} */}
                <SongGrid prop="Recently Played" setIsAudioBarVisible={setIsAudioBarVisible} showSeeAll={false} />
            </div>
        </div>
  )
}