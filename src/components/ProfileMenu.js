import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";

const ProfileMenu = ({ isLoggedIn, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!isLoggedIn) return null;

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
          <button className="logoutBtn" onClick={onLogout}>
            <FiLogOut style={{ marginRight: "8px" }} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;