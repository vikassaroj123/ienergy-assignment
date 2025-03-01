
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Movie } from '../hooks/useMovieSearch';

interface MovieContextType {
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
  favoriteMovies: Movie[];
  addFavoriteMovie: (movie: Movie) => void;
  removeFavoriteMovie: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading recent searches from localStorage', e);
      return [];
    }
  });

  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteMovies');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading favorite movies from localStorage', e);
      return [];
    }
  });

  const addRecentSearch = (term: string) => {
    if (!term || term.trim() === '') return;
    
    setRecentSearches((prev) => {
      const updatedSearches = [
        term,
        ...prev.filter((s) => s.toLowerCase() !== term.toLowerCase()),
      ].slice(0, 5);
      
      // Save to localStorage
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      
      return updatedSearches;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const addFavoriteMovie = (movie: Movie) => {
    setFavoriteMovies((prev) => {
      // Don't add if already in favorites
      if (prev.some((m) => m.imdbID === movie.imdbID)) return prev;
      
      const updatedFavorites = [...prev, movie];
      localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const removeFavoriteMovie = (id: string) => {
    setFavoriteMovies((prev) => {
      const updatedFavorites = prev.filter((m) => m.imdbID !== id);
      localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const isFavorite = (id: string) => {
    return favoriteMovies.some((m) => m.imdbID === id);
  };

  return (
    <MovieContext.Provider
      value={{
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        favoriteMovies,
        addFavoriteMovie,
        removeFavoriteMovie,
        isFavorite,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};
