import axios from 'axios';

// The base URL for the ML/Recommendation API
const ML_BASE_URL = 'https://music-recommendation-system-71od.onrender.com';

const mlApi = axios.create({
  baseURL: ML_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* Helper function to "normalize" song data from the ML API
  into the format your frontend (audio player) expects.
*/
export const normalizeSongData = (mlSong) => {
  return {
    id: mlSong.track_id, // Use track_id as the unique ID
    name: mlSong.track_name,
    artist: mlSong.artists,
    image: mlSong.img,
    src: mlSong.preview,
    // You can add other fields here if needed, e.g., album_name
    album_name: mlSong.album_name,
  };
};

export default mlApi;