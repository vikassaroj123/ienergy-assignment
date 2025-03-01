
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMovieDetails } from '../hooks/useMovieDetails';
import { ArrowLeft, Star, AlertCircle, Calendar, Clock, Film, Award, Globe, Users, Tv } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMovieContext } from '../context/MovieContext';
import { useToast } from '@/hooks/use-toast';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: movie, isLoading, error, isError } = useMovieDetails(id);
  const { isFavorite, addFavoriteMovie, removeFavoriteMovie } = useMovieContext();

  // Show error toast
  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load movie details",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  const handleFavoriteToggle = () => {
    if (!movie) return;
    
    const movieForFavorites = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Type: movie.Type,
      Poster: movie.Poster
    };
    
    if (isFavorite(movie.imdbID)) {
      removeFavoriteMovie(movie.imdbID);
      toast({
        title: "Removed from favorites",
        description: `"${movie.Title}" has been removed from your favorites.`,
      });
    } else {
      addFavoriteMovie(movieForFavorites);
      toast({
        title: "Added to favorites",
        description: `"${movie.Title}" has been added to your favorites.`,
      });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="movie-detail-container">
          <button onClick={goBack} className="back-button mb-6">
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <LoadingSpinner size="lg" text="Loading movie details..." />
        </div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="movie-detail-container">
          <button onClick={goBack} className="back-button mb-6">
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          
          <div className="py-12 text-center animate-fade-in">
            <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-red-100">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="text-red-500 mr-2" size={24} />
                <h3 className="text-xl font-medium text-gray-900">Something went wrong</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {error instanceof Error ? error.message : "Failed to load movie details"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const releaseYear = movie.Year || 'N/A';
  
  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Movie Banner */}
      <div 
        className="relative bg-gray-900 h-[300px] md:h-[400px] lg:h-[500px] bg-cover bg-center" 
        style={{ 
          backgroundImage: movie.Poster && movie.Poster !== 'N/A' 
            ? `linear-gradient(rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0.9)), url(${movie.Poster})` 
            : 'none',
          backgroundPosition: 'center 20%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
            <div className="w-full">
              <button onClick={goBack} className="mb-6 inline-flex items-center text-white opacity-80 hover:opacity-100 transition">
                <ArrowLeft size={18} className="mr-2" />
                <span>Back to search</span>
              </button>
              <div className="md:flex items-end gap-8">
                {movie.Poster && movie.Poster !== 'N/A' ? (
                  <div className="hidden md:block w-64 h-96 rounded-lg overflow-hidden shadow-2xl">
                    <img 
                      src={movie.Poster} 
                      alt={`Poster for ${movie.Title}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {movie.Title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-gray-300 text-sm">
                    {releaseYear && <span className="flex items-center"><Calendar size={16} className="mr-1" /> {releaseYear}</span>}
                    {movie.Runtime && movie.Runtime !== 'N/A' && (
                      <span className="flex items-center"><Clock size={16} className="mr-1" /> {movie.Runtime}</span>
                    )}
                    {movie.Genre && movie.Genre !== 'N/A' && (
                      <span className="flex items-center"><Film size={16} className="mr-1" /> {movie.Genre}</span>
                    )}
                    {movie.Rated && movie.Rated !== 'N/A' && (
                      <span className="px-2 py-1 text-xs rounded-md bg-gray-700">{movie.Rated}</span>
                    )}
                  </div>
                  
                  {movie.Ratings && movie.Ratings.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {movie.Ratings.map((rating, index) => (
                        <div key={index} className="px-3 py-1.5 bg-gray-800 rounded-full flex items-center">
                          <Star size={14} className="text-yellow-400 mr-1" />
                          <span className="text-xs font-medium text-white">
                            {rating.Source === 'Internet Movie Database' ? 'IMDb' : rating.Source}: {rating.Value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Poster (only visible on mobile) */}
      {movie.Poster && movie.Poster !== 'N/A' ? (
        <div className="md:hidden px-4 -mt-20 mb-8">
          <div className="w-32 h-48 mx-auto rounded-lg overflow-hidden shadow-xl">
            <img 
              src={movie.Poster} 
              alt={`Poster for ${movie.Title}`} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : null}

      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <div className="p-6 md:p-8">
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              <button
                onClick={handleFavoriteToggle}
                className="inline-flex items-center px-4 py-2 rounded-lg border transition-all duration-200
                        hover:bg-gray-50 gap-2"
                aria-label={isFavorite(movie.imdbID) ? "Remove from favorites" : "Add to favorites"}
              >
                <Star
                  size={18}
                  className={`${
                    isFavorite(movie.imdbID) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'
                  }`}
                />
                <span>
                  {isFavorite(movie.imdbID) ? 'Remove from favorites' : 'Add to favorites'}
                </span>
              </button>
            </div>

            {movie.Plot && movie.Plot !== 'N/A' && (
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">{movie.Plot}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movie.Director && movie.Director !== 'N/A' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Director</h3>
                  <p className="text-gray-900 flex items-center">
                    <Users size={16} className="mr-2 text-gray-500" />
                    {movie.Director}
                  </p>
                </div>
              )}
              
              {movie.Writer && movie.Writer !== 'N/A' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Writer</h3>
                  <p className="text-gray-900 flex items-center">
                    <Users size={16} className="mr-2 text-gray-500" />
                    {movie.Writer}
                  </p>
                </div>
              )}
              
              {movie.Actors && movie.Actors !== 'N/A' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Actors</h3>
                  <p className="text-gray-900 flex items-center">
                    <Users size={16} className="mr-2 text-gray-500" />
                    {movie.Actors}
                  </p>
                </div>
              )}
              
              {movie.Language && movie.Language !== 'N/A' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Language</h3>
                  <p className="text-gray-900 flex items-center">
                    <Globe size={16} className="mr-2 text-gray-500" />
                    {movie.Language}
                  </p>
                </div>
              )}
              
              {movie.Country && movie.Country !== 'N/A' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Country</h3>
                  <p className="text-gray-900 flex items-center">
                    <Globe size={16} className="mr-2 text-gray-500" />
                    {movie.Country}
                  </p>
                </div>
              )}
              
              {movie.Awards && movie.Awards !== 'N/A' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Awards</h3>
                  <p className="text-gray-900 flex items-center">
                    <Award size={16} className="mr-2 text-gray-500" />
                    {movie.Awards}
                  </p>
                </div>
              )}
              
              {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Box Office</h3>
                  <p className="text-gray-900 font-semibold">{movie.BoxOffice}</p>
                </div>
              )}
              
              {movie.Type && movie.Type !== 'N/A' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Type</h3>
                  <p className="text-gray-900 flex items-center">
                    <Tv size={16} className="mr-2 text-gray-500" />
                    {movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}
                  </p>
                </div>
              )}
            </div>

            {/* IMDB and More Info Links */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
              {movie.imdbID && (
                <a 
                  href={`https://www.imdb.com/title/${movie.imdbID}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="mr-2">View on IMDb</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                  </svg>
                </a>
              )}
              
              <Link 
                to="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>Back to Search</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies Section (placeholder) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">
            Related movie recommendations coming soon!
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <Film className="h-6 w-6 text-movie-accent" />
                <h3 className="ml-2 text-lg font-semibold text-gray-800">CineSaga</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">Discover your next favorite movie</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-900 transition">About</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition">Terms</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition">Contact</a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} CineSaga. All rights reserved.</p>
            <p className="mt-1">Powered by the OMDB API</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MovieDetail;
