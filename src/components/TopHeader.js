import './TopHeader.css';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from "./ProfileMenu";
import React, { useState, useEffect, useCallback } from 'react';
import mlApi, { normalizeSongData } from '../apiMl'; // Import ML API
import { debounce } from 'lodash'; // Using lodash for debouncing

// Pass in song setters
export default function TopHeader({ isLoggedIn, onLogout, setCurrentSong, setIsAudioBarVisible }) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  // Debounced search function
  const fetchSearch = useCallback(
    debounce(async (query) => {
      if (query.trim() !== '') {
        try {
          const response = await mlApi.get('/search', {
            params: { query: query }
          });
          // Normalize the data from the ML API
          const normalizedResults = response.data.map(normalizeSongData);
          setSearchResults(normalizedResults);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300), // 300ms delay
    []
  );

  useEffect(() => {
    fetchSearch(search);
  }, [search, fetchSearch]);

  // Handle clicking a song in the search results
  const handleSongClick = (song) => {
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
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay to allow click
            value={search}
          />
          <div className="search-lens">
            <SearchIcon fontSize="large" />
          </div>

          {/* Show dropdown if focused and has results */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="search-results">
              <ul>
                {searchResults.map(song => (
                  // Use onMouseDown to trigger before onBlur
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