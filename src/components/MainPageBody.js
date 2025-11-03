import React from "react";
import BannerSection from "./BannerSection";
import RecentlyPlayed from "./RecentlyPlayed";
import RecommendedSongs from "./RecommendedSongs";
import Artists from "./Artists";
import Genre from "./Genre";
import LibraryDesign from "./LibraryDesign";

// Point 7: Accept setIsAudioBarVisible
export default function MainPageBody({ currentPage, setIsAudioBarVisible }) {
  return (
    <div className="main-page-body">
      {currentPage === "library" ? (
        <LibraryDesign setIsAudioBarVisible={setIsAudioBarVisible} />
      ) : (
        <>
          <BannerSection />
          {/* Point 7: Pass prop to children */}
          <RecentlyPlayed setIsAudioBarVisible={setIsAudioBarVisible} />
          <RecommendedSongs setIsAudioBarVisible={setIsAudioBarVisible} />
          <Artists setIsAudioBarVisible={setIsAudioBarVisible} />
          {/* Point 4: Added id for scrolling */}
          <div id="genre-section">
            <Genre setIsAudioBarVisible={setIsAudioBarVisible} />
          </div>
        </>
      )}
    </div>
  );
}