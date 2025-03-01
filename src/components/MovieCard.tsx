
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Movie } from '../hooks/useMovieSearch';
import { useMovieContext } from '../context/MovieContext';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { isFavorite, addFavoriteMovie, removeFavoriteMovie } = useMovieContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const posterUrl = movie.Poster && movie.Poster !== 'N/A' 
    ? movie.Poster 
    : 'https://via.placeholder.com/300x450?text=No+Poster';

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(movie.imdbID)) {
      removeFavoriteMovie(movie.imdbID);
    } else {
      addFavoriteMovie(movie);
    }
  };

  return (
    <Link to={`/movie/${movie.imdbID}`} className="movie-card animate-fade-in">
      <div className="relative overflow-hidden group">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse-slow">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        <img
          src={posterUrl}
          alt={`Poster for ${movie.Title}`}
          className={`movie-poster transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full 
                    shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label={isFavorite(movie.imdbID) ? "Remove from favorites" : "Add to favorites"}
        >
          <Star
            size={18}
            className={`transition-colors ${
              isFavorite(movie.imdbID) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'
            }`}
          />
        </button>
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">{movie.Year}</p>
      </div>
    </Link>
  );
};

export default React.memo(MovieCard);
