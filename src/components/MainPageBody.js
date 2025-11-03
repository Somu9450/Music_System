import React from "react";
import BannerSection from "./BannerSection";
import RecentlyPlayed from "./RecentlyPlayed";
import RecommendedSongs from "./RecommendedSongs";
import Artists from "./Artists";
import Genre from "./Genre";
import LibraryDesign from "./LibraryDesign";

// Accept and pass token
export default function MainPageBody({ currentPage, setIsAudioBarVisible, setCurrentSong, token }) {
  
  const pageBodyClass = currentPage === "library" ? "page-body-library" : "page-body-home";

  return (
    <div className={`main-page-body ${pageBodyClass}`}>
      {currentPage === "library" ? (
        <LibraryDesign 
          setIsAudioBarVisible={setIsAudioBarVisible} 
          setCurrentSong={setCurrentSong}
          token={token} // Pass token
        />
      ) : (
        <>
          <BannerSection />
          <RecentlyPlayed 
            setIsAudioBarVisible={setIsAudioBarVisible} 
            setCurrentSong={setCurrentSong}
            token={token} // Pass token
          />
          <RecommendedSongs 
            setIsAudioBarVisible={setIsAudioBarVisible} 
            setCurrentSong={setCurrentSong}
            token={token} // Pass token
          />
          <Artists 
            setIsAudioBarVisible={setIsAudioBarVisible} 
            setCurrentSong={setCurrentSong}
            token={token} // Pass token
          />
          <div id="genre-section">
            <Genre 
              setIsAudioBarVisible={setIsAudioBarVisible} 
              setCurrentSong={setCurrentSong}
              token={token} // Pass token
            />
          </div>
        </>
      )}
    </div>
  );
}