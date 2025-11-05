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
export const getSongData = (mlSong) => {
  return {
    id: mlSong.track_id || mlSong._id || mlSong.songId, 
    name: mlSong.track_name || mlSong.title,
    artist: mlSong.artists || mlSong.artist,
    image: mlSong.img || mlSong.coverImage,
    src: mlSong.preview || mlSong.src,
    album_name: mlSong.album_name || mlSong.album, // Make sure this is included
  };
};

/**
 * NEW FUNCTION
 * Fetches popular songs and extracts a unique list of artists from them.
 * This avoids hardcoding artist names and provides a dynamic list.
 */
export const getArtistData = async (limit = 20) => {
  try {
    // Fetch a larger list of popular songs to get a good variety of artists
    const response = await mlApi.get('/popular?limit=100');
    const songs = response.data;

    const artistMap = new Map();

    // Create a map of unique artists, using the first image found for them
    for (const song of songs) {
      if (song.artists && !artistMap.has(song.artists)) {
        artistMap.set(song.artists, {
          type: 'artist', // Set type for LibraryGridMenu
          name: song.artists,
          image: song.img || '/logo192.png', // Use song image as artist image
        });
      }
    }

    // Return an array of artist objects, respecting the limit
    return Array.from(artistMap.values()).slice(0, limit);

  } catch (err) {
    console.error("Failed to fetch and normalize artist data", err);
    return [];
  }
};


export default mlApi;