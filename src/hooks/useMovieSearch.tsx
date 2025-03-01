
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface MovieSearchResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

const API_KEY = 'b9bd48a6';

export const fetchMovies = async (
  searchTerm: string,
  page: number = 1
): Promise<MovieSearchResponse> => {
  if (!searchTerm || searchTerm.trim() === '') {
    return { Response: 'False', Error: 'Please enter a search term' };
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { Response: 'False', Error: 'Failed to fetch movies' };
  }
};

export const useMovieSearch = (searchTerm: string, page: number = 1) => {
  return useQuery({
    queryKey: ['movies', searchTerm, page],
    queryFn: () => fetchMovies(searchTerm, page),
    enabled: searchTerm.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSuggestions = (searchTerm: string) => {
  return useQuery({
    queryKey: ['suggestions', searchTerm],
    queryFn: () => fetchMovies(searchTerm),
    enabled: searchTerm.trim().length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
