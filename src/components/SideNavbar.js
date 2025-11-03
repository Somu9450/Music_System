import React from 'react';
import './SideNavbar.css';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';

export default function SideNavbar({ setCurrentPage }) {

  const handleHomeClick = () => {
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLibraryClick = () => {
    setCurrentPage("library");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePodcastClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="left-sidebar">
      <ul className="sidebar-menu">
        <li onClick={handleHomeClick}>
          <HomeFilledIcon />
        </li>
        <li onClick={handleLibraryClick}>
          <LibraryMusicIcon />
        </li>
        <li onClick={handlePodcastClick}>
          <PodcastsIcon />
        </li>
      </ul>
    </div>
  );
}
