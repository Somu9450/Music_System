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

  // Point 4: Updated Podcast click handler
  const handlePodcastClick = () => {
    setCurrentPage("home"); // Ensure we are on the home page
    // Use a slight delay to allow the page to re-render if it was on 'library'
    setTimeout(() => {
      const genreElement = document.getElementById("genre-section");
      if (genreElement) {
        genreElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Fallback just in case
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
    }, 0);
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