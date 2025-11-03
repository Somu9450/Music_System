import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

const ProfileMenu = ({ isLoggedIn, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate(); // 2. Initialize navigate

  if (!isLoggedIn) return null;

  // 3. Create a handler that calls onLogout AND navigates
  const handleLogoutClick = () => {
    onLogout();
    navigate('/'); // Point 5: Changed from '/login' to '/'
  };

  return (
    <div className="container">
      <img
        src="/profile.jpg"
        alt="Profile"
        className="avatar"
        onClick={() => setShowMenu(!showMenu)}
      />

      {showMenu && (
        <div className="menu">
          {/* 4. Use the new handler here */}
          <button className="logoutBtn" onClick={handleLogoutClick}>
            <FiLogOut style={{ marginRight: "8px" }} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;