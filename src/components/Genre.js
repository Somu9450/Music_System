import React from 'react'
import SongGrid from './SongGrid'
import './Genre.css'

export default function Genre({ setIsAudioBarVisible, setCurrentSong, token }) {
  return (
    <div className='genre'>
            
            <div>
                <SongGrid 
                  prop="Genre" 
                  setIsAudioBarVisible={setIsAudioBarVisible} 
                  showSeeAll={false} 
                  setCurrentSong={setCurrentSong}
                  token={token}
                />
            </div>
        </div>
  )
}