import React from 'react'
import SongGrid from './SongGrid'
import './Artists.css'

export default function Artists({ setIsAudioBarVisible }) {
  return (
    <div className='artists'>
        
        <div>
            {/* Point 2: Added showSeeAll={false} */}
            <SongGrid prop="Artists" setIsAudioBarVisible={setIsAudioBarVisible} showSeeAll={false} />
        </div>
    </div>
  )
}