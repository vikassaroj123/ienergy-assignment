
import { useQuery } from '@tanstack/react-query';

export interface MovieDetails {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

const API_KEY = 'b9bd48a6';

const fetchMovieDetails = async (imdbID: string): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw new Error('Failed to fetch movie details');
  }
};

export const useMovieDetails = (imdbID: string | undefined) => {
  return useQuery({
    queryKey: ['movie', imdbID],
    queryFn: () => (imdbID ? fetchMovieDetails(imdbID) : Promise.reject('No ID provided')),
    enabled: !!imdbID,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
