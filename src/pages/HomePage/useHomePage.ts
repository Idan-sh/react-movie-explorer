/**
 * useHomePage Hook
 *
 * Handles HomePage business logic:
 * - Fetches movies on mount
 * - Provides navigation handler for movie selection
 */

import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/core/store';
import { fetchMovies, MOVIE_CATEGORY, PAGINATION } from '@/modules/movies';
import type { TmdbMovie } from '@/modules/movies';

export interface UseHomePageReturn {
  handleSelectMovie: (movie: TmdbMovie) => void;
}

/**
 * Hook that manages HomePage state and side effects.
 */
export function useHomePage(): UseHomePageReturn {
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
