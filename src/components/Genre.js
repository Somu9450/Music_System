import React from 'react'
import SongGrid from './SongGrid'
import './Genre.css'

export default function Genre({ setIsAudioBarVisible }) {
  return (
    <div className='genre'>
            
            <div>
                {/* Point 2: Added showSeeAll={false} */}
                <SongGrid prop="Genre" setIsAudioBarVisible={setIsAudioBarVisible} showSeeAll={false} />
            </div>
        </div>
  )
}