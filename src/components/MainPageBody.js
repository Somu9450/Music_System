import React from "react";
import BannerSection from "./BannerSection";
import RecentlyPlayed from "./RecentlyPlayed";
import RecommendedSongs from "./RecommendedSongs";
import Artists from "./Artists";
import Genre from "./Genre";
import LibraryDesign from "./LibraryDesign";

export default function MainPageBody({ currentPage }) {
  return (
    <div className="main-page-body">
      {currentPage === "library" ? (
        <LibraryDesign />
      ) : (
        <>
          <BannerSection />
          <RecentlyPlayed />
          <RecommendedSongs />
          <Artists />
          <Genre />
        </>
      )}
    </div>
  );
}
