/**
 * useMoviesInit Hook
 *
 * Initializes movie data fetching and provides selection handler.
 * Used by pages that display the movie grid.
 */

import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/core/store';
import { fetchMovies } from '../store';
import { MOVIE_CATEGORY, PAGINATION } from '../constants';
import type { TmdbMovie } from '../types';

export interface UseMoviesInitReturn {
  handleSelectMovie: (movie: TmdbMovie) => void;
}

/**
 * Hook that initializes movies fetch and provides selection handler.
 */
export function useMoviesInit(): UseMoviesInitReturn {
  const dispatch = useAppDispatch();

  // Fetch movies on mount with explicit defaults
  useEffect(() => {
    dispatch(fetchMovies({
      category: MOVIE_CATEGORY.POPULAR,
      page: PAGINATION.DEFAULT_PAGE,
    }));
  }, [dispatch]);

  // Handle movie selection (will navigate to details page later)
  const handleSelectMovie = useCallback((movie: TmdbMovie): void => {
    // TODO: Navigate to movie details page
    console.log('Selected movie:', movie.title);
  }, []);

  return {
    handleSelectMovie,
  };
}
