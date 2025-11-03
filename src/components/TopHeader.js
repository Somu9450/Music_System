import './TopHeader.css';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from "./ProfileMenu";
import { useState } from 'react';

export default function TopHeader({ isLoggedIn, onLogout }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  return (
    <div className="top-header">
      <div className="header-left">
        <h2>Audient</h2>
      </div>

      <div className="header-center">
        <input
          type="text"
          placeholder="Search for songs, artists..."
          className="search-input"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <div className="search-lens">
          <SearchIcon fontSize="large" />
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
