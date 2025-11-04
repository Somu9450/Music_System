import React from 'react';
import './SideNavbar.css';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';

export default function SideNavbar({ setCurrentPage, setLibraryView }) {

  const handleHomeClick = () => {
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Point 6: Update My Library click
  const handleLibraryClick = () => {
    setLibraryView({ type: 'liked' }); // Set library to show Liked Songs
    setCurrentPage("library");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Point 4: Relabeled "Podcast" to "Playlist"
  const handlePlaylistClick = () => {
    setCurrentPage("home"); // Ensure we are on the home page
    setTimeout(() => {
      const genreElement = document.getElementById("genre-section");
      if (genreElement) {
        genreElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  return (
    <div className="left-sidebar">
      <ul className="sidebar-menu">
        <li onClick={handleHomeClick}>
          <HomeFilledIcon />
          <span>Home</span> {/* Point 4 */}
        </li>
        <li onClick={handleLibraryClick}>
          <LibraryMusicIcon />
          <span>My Library</span> {/* Point 4 */}
        </li>
        <li onClick={handlePlaylistClick}>
          <PodcastsIcon />
          <span>Playlist</span> {/* Point 4 */}
        </li>
      </ul>
    </div>
  );
}