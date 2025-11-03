import React from 'react'
import SongGrid from './SongGrid'
import './Artists.css'

// Point 3: Pass setCurrentSong
export default function Artists({ setIsAudioBarVisible, setCurrentSong }) {
  return (
    <div className='artists'>
        
        <div>
            <SongGrid 
              prop="Artists" 
              setIsAudioBarVisible={setIsAudioBarVisible} 
              showSeeAll={false}
              setCurrentSong={setCurrentSong} 
            />
        </div>
    </div>
  )
}