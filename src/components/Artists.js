import React from 'react'
import SongGrid from './SongGrid'
import './Artists.css'

export default function Artists({ setIsAudioBarVisible, setCurrentSong, token }) {
  return (
    <div className='artists'>
        <div>
            <SongGrid 
              prop="Artists" 
              setIsAudioBarVisible={setIsAudioBarVisible} 
              showSeeAll={false}
              setCurrentSong={setCurrentSong} 
              token={token}
            />
        </div>
    </div>
  )
}