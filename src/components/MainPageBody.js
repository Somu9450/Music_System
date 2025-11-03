import React from "react";
import BannerSection from "./BannerSection";
import RecentlyPlayed from "./RecentlyPlayed";
import RecommendedSongs from "./RecommendedSongs";
import Artists from "./Artists";
import Genre from "./Genre";
import LibraryDesign from "./LibraryDesign";

export default function MainPageBody({ currentPage, setIsAudioBarVisible }) {
  
  // Point 2 & 3: Determine conditional classes for the page body
  const pageBodyClass = currentPage === "library" ? "page-body-library" : "page-body-home";

  return (
    // Point 2 & 3: Apply the conditional class
    <div className={`main-page-body ${pageBodyClass}`}>
      {currentPage === "library" ? (
        <LibraryDesign setIsAudioBarVisible={setIsAudioBarVisible} />
      ) : (
        <>
          <BannerSection />
          <RecentlyPlayed setIsAudioBarVisible={setIsAudioBarVisible} />
          <RecommendedSongs setIsAudioBarVisible={setIsAudioBarVisible} />
          <Artists setIsAudioBarVisible={setIsAudioBarVisible} />
          <div id="genre-section">
            <Genre setIsAudioBarVisible={setIsAudioBarVisible} />
          </div>
        </>
      )}
    </div>
  );
}