import React from 'react';
import './Genre.css';
import mlApi from '../apiMl'; // Import ML API
import { useEffect, useState } from 'react';

// Point 3 & 6: Create a new GenreGrid component
function GenreGrid({ setLibraryView, setCurrentPage }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Fetch all genres from the ML API
    const fetchGenres = async () => {
      try {
        const response = await mlApi.get('/genres');
        // Get a subset of genres to display
        setGenres(response.data.slice(0, 12)); 
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    };
    fetchGenres();
  }, []);

  const handleGenreClick = (genreName) => {
    // Point 6: Set the library view and switch page
    setLibraryView({ type: 'genre', value: genreName });
    setCurrentPage('library');
  };

  return (
    <>
      <div className="grid-header">
        <div className='grid-name'><span>Genre</span></div>
      </div>
      <div className="genre-grid-container">
        {genres.length > 0 ? (
          genres.map((genreName) => (
            <div 
              className="genre-tile" 
              key={genreName}
              onClick={() => handleGenreClick(genreName)}
            >
              {genreName}
            </div>
          ))
        ) : (
          <p style={{ color: '#aaa', marginLeft: '20px' }}>Loading genres...</p>
        )}
      </div>
    </>
  );
}


export default function Genre({ setLibraryView, setCurrentPage }) {
  return (
    <div className='genre' id="genre-section">
      {/* Point 3: Use the new GenreGrid */}
      <GenreGrid 
        setLibraryView={setLibraryView} 
        setCurrentPage={setCurrentPage} 
      />
    </div>
  );
}