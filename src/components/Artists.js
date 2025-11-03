import React from 'react'
import SongGrid from './SongGrid'
import './Artists.css'

// Point 7: Accept and pass prop
export default function Artists({ setIsAudioBarVisible }) {
  return (
    <div className='artists'>
        
        <div>
            <SongGrid prop="Artists" setIsAudioBarVisible={setIsAudioBarVisible} />
        </div>
    </div>
  )
}