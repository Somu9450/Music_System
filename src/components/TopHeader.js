import './TopHeader.css';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from "./ProfileMenu";
import React, { useState, useEffect } from 'react'; // Point 6: Import hooks

export default function TopHeader({ isLoggedIn, onLogout }) {
  // Point 6: Add state for search
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  // Point 6: Dummy search logic
  useEffect(() => {
    if (search.trim() !== '') {
      // In a real app, you'd fetch data here
      setSearchResults([
        { id: 1, name: `Result for "${search}" 1` },
        { id: 2, name: `Result for "${search}" 2` },
        { id: 3, name: `Result for "${search}" 3` },
      ]);
    } else {
      setSearchResults([]);
    }
  }, [search]);


  return (
    <div className="top-header">
      <div className="header-left">
        <h2>Audient</h2>
      </div>

      {/* Point 6: Updated search bar structure */}
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

          {isSearchFocused && searchResults.length > 0 && (
            <div className="search-results">
              <ul>
                {searchResults.map(result => (
                  <li key={result.id}>{result.name}</li>
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