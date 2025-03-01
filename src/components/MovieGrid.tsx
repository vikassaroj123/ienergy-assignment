
import React from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import { Movie } from '../hooks/useMovieSearch';

interface MovieGridProps {
  movies: Movie[] | undefined;
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  isLoading,
  error,
  hasMore,
  loadingMore,
  onLoadMore,
}) => {
  // Error state
  if (error) {
    return (
      <div className="py-12 text-center animate-fade-in">
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error.message || 'Failed to load movies'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Initial loading state
  if (isLoading && !movies) {
    return <LoadingSpinner size="lg" text="Fetching movies..." />;
  }

  // Empty state
  if (!movies || movies.length === 0) {
    return (
      <div className="py-12 text-center animate-fade-in">
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No movies found</h3>
          <p className="text-gray-600">
            Try searching for a different movie or check your spelling.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>

      {(hasMore || loadingMore) && (
        <div className="pt-4 pb-8 flex justify-center">
          {loadingMore ? (
            <LoadingSpinner size="md" text="Loading more movies..." />
          ) : (
            <button
              onClick={onLoadMore}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 
                        transition-all duration-200 shadow-sm hover:shadow"
            >
              Load More Movies
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(MovieGrid);
