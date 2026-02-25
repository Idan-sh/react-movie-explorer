/**
 * useMoviesInit Hook
 *
 * Initializes movie data fetching for both lists on mount.
 * Provides selection handler for movie cards.
 */

import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/core/store';
import { fetchMovies } from '../store';
import { MOVIE_LIST, PAGINATION } from '../constants';
import type { TmdbMovie } from '../types';

export interface UseMoviesInitReturn {
  handleSelectMovie: (movie: TmdbMovie) => void;
}

/**
 * Hook that fetches both movie lists on mount.
 */
export function useMoviesInit(): UseMoviesInitReturn {
  const dispatch = useAppDispatch();

  // Fetch both lists on mount for home preview
  useEffect(() => {
    dispatch(fetchMovies({
      list: MOVIE_LIST.POPULAR,
      pageNumber: PAGINATION.DEFAULT_PAGE,
    }));
    dispatch(fetchMovies({
      list: MOVIE_LIST.NOW_PLAYING,
      pageNumber: PAGINATION.DEFAULT_PAGE,
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
