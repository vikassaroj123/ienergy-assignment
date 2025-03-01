
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useMovieSearch, Movie } from '../hooks/useMovieSearch';
import { useMovieContext } from '../context/MovieContext';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { AlertCircle, Film } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const POPULAR_SEARCHES = ['Marvel', 'Star Wars', 'Harry Potter', 'Batman', 'Lord of the Rings'];

const Index: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  
  // Get the search query from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
      setPage(1); // Reset to page 1 for new searches
    } else if (!searchTerm) {
      // Pick a random popular search if no search term
      const randomSearch = POPULAR_SEARCHES[Math.floor(Math.random() * POPULAR_SEARCHES.length)];
      setSearchTerm(randomSearch);
    }
  }, [location.search]);

  // Fetch movies based on search term and page
  const { 
    data, 
    isLoading, 
    error,
    isError
  } = useMovieSearch(searchTerm, page);

  // Reset movies when search term changes
  useEffect(() => {
    if (page === 1) {
      setAllMovies([]);
    }
  }, [searchTerm, page]);

  // Update all movies when data changes
  useEffect(() => {
    if (data?.Search && data.Response === 'True') {
      setAllMovies((prev) => 
        page === 1 
          ? [...data.Search] 
          : [...prev, ...data.Search.filter(movie => 
              !prev.some(m => m.imdbID === movie.imdbID)
            )]
      );
    }
  }, [data, page]);

  // Show error toast
  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load movies",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (data?.Response === 'True' && data.totalResults) {
      const totalResults = parseInt(data.totalResults);
      if (allMovies.length < totalResults) {
        setLoadingMore(true);
        setPage((prev) => prev + 1);
        
        // Simulate a delay for smoother UX
        setTimeout(() => {
          setLoadingMore(false);
        }, 800);
      }
    }
  }, [data, allMovies.length]);

  // Calculate if we have more results
  const totalResults = data?.totalResults ? parseInt(data.totalResults) : 0;
  const hasMore = totalResults > allMovies.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Film className="h-12 w-12 text-movie-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Movies
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Search through thousands of movies and find your next favorite film. 
              Detailed information, ratings, and more at your fingertips.
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {searchTerm && (
          <div className="mb-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-800">
              {data?.Response === 'True' && data.totalResults 
                ? `Found ${data.totalResults} results for "${searchTerm}"`
                : `Search results for "${searchTerm}"`
              }
            </h2>
          </div>
        )}

        {isError && (
          <div className="py-12 text-center animate-fade-in">
            <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-red-100">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="text-red-500 mr-2" size={24} />
                <h3 className="text-xl font-medium text-gray-900">Something went wrong</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {error instanceof Error ? error.message : "Failed to load movies"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {!isError && (
          <MovieGrid
            movies={allMovies}
            isLoading={isLoading && page === 1}
            error={error instanceof Error ? error : null}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={handleLoadMore}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <Film className="h-6 w-6 text-movie-accent" />
                <h3 className="ml-2 text-lg font-semibold text-gray-800">i-energy</h3>
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
            <p>&copy; {new Date().getFullYear()} i-energy. All rights reserved.</p>
            <p className="mt-1">Powered by the OMDB API</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
