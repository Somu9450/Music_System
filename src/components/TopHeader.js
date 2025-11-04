import './TopHeader.css';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from "./ProfileMenu";
import React, { useState, useEffect, useCallback } from 'react';
import mlApi, { normalizeSongData } from '../apiMl'; 
import { debounce } from 'lodash'; 

export default function TopHeader({ 
  isLoggedIn, 
  onLogout, 
  setCurrentSong, 
  setIsAudioBarVisible,
  token // Point 1: Added token
}) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const fetchSearch = useCallback(
    debounce(async (query) => {
      if (query.trim() !== '') {
        try {
          const response = await mlApi.get('/search', {
            params: { query: query }
          });
          const normalizedResults = response.data.map(normalizeSongData);
          setSearchResults(normalizedResults);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300), 
    []
  );

  useEffect(() => {
    fetchSearch(search);
  }, [search, fetchSearch]);

  const handleSongClick = (song) => {
    // Point 1 & 2: Check for login
    if (!token) {
      alert("Please login to play music.");
      return;
    }
    
    setCurrentSong(song);
    setIsAudioBarVisible(true);
    setSearch('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  return (
    <div className="top-header">
      <div className="header-left">
        <h2>Audient</h2>
      </div>

      <div className="header-center">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search for songs, artists..."
            className="search-input"
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} 
            value={search}
          />
          <div className="search-lens">
            <SearchIcon fontSize="large" />
          </div>

          {isSearchFocused && searchResults.length > 0 && (
            <div className="search-results">
              <ul>
                {searchResults.map(song => (
                  <li key={song.id} onMouseDown={() => handleSongClick(song)}>
                    {song.name} - <span>{song.artist}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <ProfileMenu isLoggedIn={isLoggedIn} onLogout={onLogout} />
        ) : (
          <>
            <button className="header-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="header-btn" onClick={() => navigate('/signup')}>Signup</button>
          </>
        )}
      </div>
    </div>
  );
}