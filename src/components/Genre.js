import React from 'react'
import SongGrid from './SongGrid'
import './Genre.css'

// Point 7: Accept and pass prop
export default function Genre({ setIsAudioBarVisible }) {
  return (
    <div className='genre'>
            
            <div>
                <SongGrid prop="Genre" setIsAudioBarVisible={setIsAudioBarVisible} />
            </div>
        </div>
  )
}