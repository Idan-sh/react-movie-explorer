import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import type { TmdbMovie } from '../../types';
import { RECOMMENDATIONS } from '../../constants';

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
    () => movies.slice(0, RECOMMENDATIONS.MAX_DISPLAY),
    [movies],
  );

  return { displayMovies, handleSelect };
}
