import axios from 'axios';

const ML_BASE_URL = 'https://music-recommendation-system-71od.onrender.com';

const mlApi = axios.create({
  baseURL: ML_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* This function is correct. It prepares the data for the frontend.
  We will use these keys to map to the backend keys in our API calls.
*/
export const normalizeSongData = (mlSong) => {
  return {
    id: mlSong.track_id, 
    name: mlSong.track_name,
    artist: mlSong.artists,
    image: mlSong.img,
    src: mlSong.preview,
    album_name: mlSong.album_name, // Make sure this is included
  };
};

export default mlApi;