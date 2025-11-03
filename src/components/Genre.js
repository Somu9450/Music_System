import React from 'react'
import SongGrid from './SongGrid'
import './Genre.css'

// Point 3: Pass setCurrentSong
export default function Genre({ setIsAudioBarVisible, setCurrentSong }) {
  return (
    <div className='genre'>
            
            <div>
                <SongGrid 
                  prop="Genre" 
                  setIsAudioBarVisible={setIsAudioBarVisible} 
                  showSeeAll={false} 
                  setCurrentSong={setCurrentSong}
                />
            </div>
        </div>
  )
}