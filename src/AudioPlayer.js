import React from 'react';


function AudioPlayer({ songSrc }) {
  return (
    <div className="audio-player-container">
  
      <audio controls autoPlay key={songSrc}>
        <source src={songSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default AudioPlayer;