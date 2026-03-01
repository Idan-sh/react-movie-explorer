import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import type { TmdbMovie } from '../../types';

const MAX_RECOMMENDATIONS = 10;

interface UseMovieRecommendationsReturn {
  displayMovies: TmdbMovie[];
  handleSelect: (movie: TmdbMovie) => void;
}

export function useMovieRecommendations(
  movies: TmdbMovie[],
): UseMovieRecommendationsReturn {
  const navigate = useNavigate();

  const handleSelect = useCallback(
    (movie: TmdbMovie): void => {
      navigate(ROUTES.movieDetails(movie.id), { viewTransition: true });
    },
    [navigate],
  );

  const displayMovies = useMemo(
    () => movies.slice(0, MAX_RECOMMENDATIONS),
    [movies],
  );

  return { displayMovies, handleSelect };
}
