import './App.css';
import TopHeader from './components/TopHeader';
import SideNavbar from './components/SideNavbar';
import BannerSection from './components/BannerSection';
import SongGrid from './components/SongGrid';
import RecentlyPlayed from './components/RecentlyPlayed';
import LibraryDesign from './components/LibraryDesign';
import React from 'react';
import RecommendedSongs from './components/RecommendedSongs';
import Artists from './components/Artists';
import Genre from './components/Genre';
import AudioPlayer from './AudioPlayer';

function App() {
  return (
    <div className="App">
      <TopHeader />
      <div className="main-content">
        <SideNavbar />
        <div className="page-body">
          <BannerSection />
          <RecentlyPlayed />
          <RecommendedSongs />
          <Artists />
          <Genre />
        </div>
      </div>
      <div className="audio-player">
        <AudioPlayer />
      </div>
    </div>
  );
}

export default App;
