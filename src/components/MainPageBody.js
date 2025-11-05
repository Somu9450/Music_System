import React from "react";
import BannerSection from "./BannerSection";
import RecentlyPlayed from "./RecentlyPlayed";
import RecommendedSongs from "./RecommendedSongs";
import Artists from "./Artists";
import Genre from "./Genre";
import LibraryDesign from "./LibraryDesign";

export default function MainPageBody({ 
  currentPage, 
  setIsAudioBarVisible, 
  setCurrentSong, 
  token,
  libraryView, 
  setLibraryView, 
  setCurrentPage,
  likedSongsMap,
  handleLikeToggle
}) {
  
  const pageBodyClass = currentPage === "library" ? "page-body-library" : "page-body-home";

  return (
    <div className={`main-page-body ${pageBodyClass}`}>
      {currentPage === "library" ? (
        <LibraryDesign 
          setIsAudioBarVisible={setIsAudioBarVisible} 
          setCurrentSong={setCurrentSong}
          token={token}
          libraryView={libraryView} 
          setLibraryView={setLibraryView} 
          likedSongsMap={likedSongsMap}
          handleLikeToggle={handleLikeToggle}
        />
      ) : (
        <>
          {/* Props are now passed to BannerSection */}
          <BannerSection 
            setIsAudioBarVisible={setIsAudioBarVisible}
            setCurrentSong={setCurrentSong}
            token={token}
          />
          <RecentlyPlayed 
            setIsAudioBarVisible={setIsAudioBarVisible} 
            setCurrentSong={setCurrentSong}
            token={token}
          />
          <RecommendedSongs 
            setIsAudioBarVisible={setIsAudioBarVisible} 
            setCurrentSong={setCurrentSong}
            token={token}
            setLibraryView={setLibraryView} // For "See All"
            setCurrentPage={setCurrentPage} // For "See All"
          />
          <Artists 
            setLibraryView={setLibraryView} 
            setCurrentPage={setCurrentPage} 
          />
          <div id="genre-section">
            <Genre 
              setIsAudioBarVisible={setIsAudioBarVisible} 
              setCurrentSong={setCurrentSong}
              token={token}
              setLibraryView={setLibraryView} 
              setCurrentPage={setCurrentPage} 
            />
          </div>
        </>
      )}
    </div>
  );
}