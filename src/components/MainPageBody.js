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
  libraryView, // Point 6
  setLibraryView, // Point 6
  setCurrentPage // Point 6
}) {
  
  const pageBodyClass = currentPage === "library" ? "page-body-library" : "page-body-home";

  return (
    <div className={`main-page-body ${pageBodyClass}`}>
      {currentPage === "library" ? (
        <LibraryDesign 
          setIsAudioBarVisible={setIsAudioBarVisible} 
          setCurrentSong={setCurrentSong}
          token={token}
          libraryView={libraryView} // Point 6
          setLibraryView={setLibraryView} // Point 6
        />
      ) : (
        <>
          <BannerSection />
          <RecentlyPlayed 
            setIsAudioBarVisible={setIsAudioBarVisible} 
            setCurrentSong={setCurrentSong}
            token={token}
          />
          <RecommendedSongs 
            setIsAudioBarVisible={setIsAudioBarVisible} 
            setCurrentSong={setCurrentSong}
            token={token}
          />
          <Artists 
            setIsAudioBarVisible={setIsAudioBarVisible} 
            setCurrentSong={setCurrentSong}
            token={token}
            setLibraryView={setLibraryView} // Point 6
            setCurrentPage={setCurrentPage} // Point 6
          />
          <div id="genre-section">
            <Genre 
              setIsAudioBarVisible={setIsAudioBarVisible} 
              setCurrentSong={setCurrentSong}
              token={token}
              setLibraryView={setLibraryView} // Point 6
              setCurrentPage={setCurrentPage} // Point 6
            />
          </div>
        </>
      )}
    </div>
  );
}