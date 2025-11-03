import React from 'react';
import './BannerSection.css';
import dashboard from './assets/dashboard.jpg';

export default function BannerSection() {
  return (
    <div className="banner-section">
      <img src={dashboard} alt="Banner" className="banner-img" />
      <div className="banner-text">
        <h1>Feel the beat</h1>
        <p>Immerse yourself into the world of music today</p>
        <button className="listen-btn">Listen Now</button>
      </div>
    </div>
  );
}