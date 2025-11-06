// import React, { useState, useEffect } from 'react'
// import SongGrid from './SongGrid'
// import './RecentlyPlayed.css'
// import api from '../api'; 

// export default function RecentlyPlayed({ setIsAudioBarVisible, setCurrentSong, token }) {
//   const [recentSongs, setRecentSongs] = useState([]);

//   useEffect(() => {
//     const fetchRecent = async () => {
//       if (!token) {
//         setRecentSongs([]);
//         return;
//       }
//       try {
//         const response = await api.get('/api/recent/');
        
//         const songsFromDb = Array.isArray(response.data.songs) ? response.data.songs : 
//                             Array.isArray(response.data) ? response.data : [];

//         const normalized = songsFromDb.map(song => ({
//           id: song.track_id || song._id, 
//           _id: song._id,
//           name: song.track_name || song.name, 
//           artist: song.artists || song.artist,
//           image: song.img || song.image,
//           src: song.src
//         }))


//         .reverse(); 

//         setRecentSongs(normalized || []);
//       } catch (err) {
//         console.error("Failed to fetch recent songs", err);
//         setRecentSongs([]); 
//       }
//     };

//     fetchRecent();
//   }, [token]); 

//   return (
//     <div className='recently-played'>
//       <div>
//         <SongGrid 
//           prop="Recently Played" 
//           setIsAudioBarVisible={setIsAudioBarVisible} 
//           showSeeAll={false} 
//           setCurrentSong={setCurrentSong}
//           token={token}
//           songs={recentSongs} 
//         />
//       </div>
//     </div>
//   )
// }