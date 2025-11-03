import React from 'react';

function AudioPlayer() {
  return (
    <div className="audio-player-container">
      <audio controls style={{ width: '100%' }}>
        <source src="https://p.scdn.co/mp3-preview/5c00aeb796dc03f5abcc276ad7a0a7f7c1b4f01b?cid=774b29d4f13844c495f206cafdad9c86" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default AudioPlayer;
