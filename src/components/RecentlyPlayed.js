import React from 'react'
import SongGrid from './SongGrid'
import './RecentlyPlayed.css'


export default function RecentlyPlayed() {
  return (
    <div className='recently-played'>
            
            <div>
                <SongGrid prop="Recently Played"/>
            </div>
        </div>
  )
}
