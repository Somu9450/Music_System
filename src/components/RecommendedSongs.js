import React from 'react'
import SongGrid from './SongGrid'
import './RecommendedSongs.css'


export default function RecommendedSongs() {
  return (
    <div className='recommended-songs'>
        
        <div>
            <SongGrid prop="Recommended"/>
        </div>
    </div>
  )
}
