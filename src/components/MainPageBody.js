import React from "react";
import BannerSection from "./BannerSection";
import RecentlyPlayed from "./RecentlyPlayed";
import RecommendedSongs from "./RecommendedSongs";
import Artists from "./Artists";
import Genre from "./Genre";
import LibraryDesign from "./LibraryDesign";

// Note: No 'songData' prop. This is the correct, up-to-date component.
export default function MainPageBody({ currentPage, setIsAudioBarVisible, setCurrentSong, token }) {
  
  const pageBodyClass = currentPage === "library" ? "page-body-library" : "page-body-home";

  return (
    <div className={`main-page-body ${pageBodyClass}`}>
      {currentPage === "library" ? (
        <LibraryDesign 
          setIsAudioBarVisible={setIsAudioBarVisible} 
          setCurrentSong={setCurrentSong}
          token={token}
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
          />
          <div id="genre-section">
            <Genre 
              setIsAudioBarVisible={setIsAudioBarVisible} 
              setCurrentSong={setCurrentSong}
              token={token}
            />
          </div>
        </>
      )}
    </div>
  );
}