import React, { useState, useEffect } from 'react';
import './BannerSection.css';
// API imports
import mlApi, { normalizeSongData } from '../apiMl';
import api from '../api'; // For adding to recently played

// Default fallback image in case API fails
import dashboard from './assets/dashboard.jpg';

export default function BannerSection({ setCurrentSong, setIsAudioBarVisible, token }) {
  const [bannerSong, setBannerSong] = useState(null);

  useEffect(() => {
    const fetchBannerSong = async () => {
      try {
        // Fetch 1 popular song to display in the banner
        const response = await mlApi.get('/popular', { params: { limit: 1 } });
        if (response.data && response.data.length > 0) {
          const normalizedSong = normalizeSongData(response.data[0]);
          setBannerSong(normalizedSong);
        }
      } catch (err) {
        console.error("Failed to fetch banner song", err);
      }
    };
    fetchBannerSong();
  }, []); // Runs once on component mount

  const handleListenNow = () => {
    if (!token) {
      alert("Please login to play music.");
      return;
    }
    if (bannerSong) {
      setCurrentSong(bannerSong);
      setIsAudioBarVisible(true);
      
      // Add to "Recently Played"
      api.post('/api/recent/add', { 
        songId: bannerSong.id,
        track_id: bannerSong.id,
        track_name: bannerSong.name,
        artists: bannerSong.artist,
        album_name: bannerSong.album_name,
        img: bannerSong.image,
        src: bannerSong.src
      }).catch(err => console.warn("Failed to add banner song to recent", err));
    }
  };

  const songImage = bannerSong ? bannerSong.image : dashboard;
  const songName = bannerSong ? bannerSong.name : "Feel the beat";
  const songArtist = bannerSong ? bannerSong.artist : "Immerse yourself into the world of music today";

  return (
    <div className="banner-section">
      <img src={songImage} alt="Banner" className="banner-img" />
      <div className="banner-text">
        <h1>{songName}</h1>
        <p>{songArtist}</p>
        <button className="listen-btn" onClick={handleListenNow}>
          Listen Now
        </button>
      </div>
    </div>
  );
}