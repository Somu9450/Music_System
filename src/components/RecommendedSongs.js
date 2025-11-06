// import React, { useState, useEffect } from 'react'
// import SongGrid from './SongGrid'
// import './RecommendedSongs.css'
// import mlApi, { getSongData } from '../apiMl'; 

// export default function RecommendedSongs({ 
//   setIsAudioBarVisible, 
//   setCurrentSong, 
//   token,
//   setLibraryView, 
//   setCurrentPage 
// }) {
//   const [songs, setSongs] = useState([]);
  
//   useEffect(() => {
//     const fetchPopular = async () => {
//       try {
//         const response = await mlApi.get('/popular?limit=10');
//         const normalized = response.data.map(getSongData);
//         setSongs(normalized);
//       } catch (err) {
//         console.error("Failed to fetch popular songs", err);
//       }
//     };
//     fetchPopular();
//   }, []); 

 
//   const handleSeeAllClick = () => {
//     setLibraryView({ type: 'recommended' });
//     setCurrentPage('library');
//   };

//   return (
//     <div className='recommended-songs'>
//         <div>
//             <SongGrid 
//               prop="Recommended" 
//               setIsAudioBarVisible={setIsAudioBarVisible} 
//               setCurrentSong={setCurrentSong}
//               token={token}
//               songs={songs} 
//               showSeeAll={true} 
//               onSeeAllClick={handleSeeAllClick} 
//             />
//         </div>
//     </div>
//   )
// }