import React from 'react';

// Point 3: Accept songSrc prop
function AudioPlayer({ songSrc }) {
  return (
    <div className="audio-player-container">
      {/* Point 3: Use songSrc and add a key to force re-render on change */}
      <audio controls autoPlay key={songSrc}>
        <source src={songSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default AudioPlayer;