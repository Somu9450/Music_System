import React from 'react';
import TopHeader from './components/TopHeader';
import SideNavbar from './components/SideNavbar';
import MainPageBody from './components/MainPageBody';
import StickyAudioBar from './AudioPlayer';
import './MainHomePage.css';

function MainHomePage({ songData }) {
  return (
    <div className="App">
      <TopHeader />
      <div className="main-content">
        <SideNavbar />
        <div className="page-body">
          <MainPageBody />
        </div>
      </div>
      <div className="audio-bar">
        <div className="song-info">
          <img
            src="https://shop.umusic.com.au/cdn/shop/files/Ariana_Grande_Square_ee3066c3-03a7-4f2a-9e46-343debe41811.jpg?v=1750312888&width=900"
            alt="Song Poster"
          />
          <div className="song-details">
            Everyday <br />
            <span>Ariana Grande</span>
          </div>
        </div>
        <div className="player-wrapper">
          <StickyAudioBar />
        </div>
      </div>
    </div>
  );
}

export default MainHomePage;
