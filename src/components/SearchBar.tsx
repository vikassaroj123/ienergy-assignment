
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Film } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';
import { useSuggestions, Movie } from '../hooks/useMovieSearch';
import { useMovieContext } from '../context/MovieContext';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { recentSearches, addRecentSearch } = useMovieContext();
  
  const { data: suggestionsData, isLoading } = useSuggestions(debouncedSearchTerm);
  
  const suggestions = suggestionsData?.Search || [];
  const hasSuggestions = suggestions.length > 0;
  const showSuggestions = isFocused && (debouncedSearchTerm.length > 2 || recentSearches.length > 0);

  const handleSearch = (term: string) => {
    if (!term || term.trim() === '') return;
    
    addRecentSearch(term);
    navigate(`/?search=${encodeURIComponent(term)}`);
    setIsFocused(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (item: string | Movie) => {
    if (typeof item === 'string') {
      setSearchTerm(item);
      handleSearch(item);
    } else {
      setSearchTerm(item.Title);
      addRecentSearch(item.Title);
      navigate(`/movie/${item.imdbID}`);
    }
  };

  const handleClearInput = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search for movies..."
            className="search-input pl-10"
            autoComplete="off"
          />
          
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearInput}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="search-results animate-fade-in max-h-[420px] overflow-y-auto"
        >
          {debouncedSearchTerm.length > 2 ? (
            <>
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                  Loading suggestions...
                </div>
              ) : hasSuggestions ? (
                <>
                  <div className="p-2 text-xs font-medium text-gray-500 uppercase">
                    Movies
                  </div>
                  {suggestions.slice(0, 5).map((movie) => (
                    <div
                      key={movie.imdbID}
                      className="search-item"
                      onClick={() => handleSuggestionClick(movie)}
                    >
                      <div className="flex-shrink-0 w-10 h-14 bg-gray-100 rounded overflow-hidden">
                        {movie.Poster && movie.Poster !== 'N/A' ? (
                          <img 
                            src={movie.Poster} 
                            alt={movie.Title} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film size={16} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-medium truncate">{movie.Title}</div>
                        <div className="text-sm text-gray-500">{movie.Year}</div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-2 border-t border-gray-100">
                    <button
                      className="w-full py-2 text-sm text-gray-700 hover:text-gray-900 transition text-center"
                      onClick={() => handleSearch(debouncedSearchTerm)}
                    >
                      Search for "{debouncedSearchTerm}"
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-600">
                  No results found for "{debouncedSearchTerm}"
                </div>
              )}
            </>
          ) : recentSearches.length > 0 ? (
            <>
              <div className="p-2 text-xs font-medium text-gray-500 uppercase">
                Recent Searches
              </div>
              {recentSearches.map((term, index) => (
                <div
                  key={`${term}-${index}`}
                  className="search-item"
                  onClick={() => handleSuggestionClick(term)}
                >
                  <Clock size={16} className="text-gray-400" />
                  <div className="truncate">{term}</div>
                </div>
              ))}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchBar);
