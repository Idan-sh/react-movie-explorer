/**
 * useMovieGrid Hook
 *
 * Provides data and state for MovieGrid component.
 * Keyboard navigation logic will be in navigation module.
 */

import { useAppSelector } from '@/core/store';
import {
  selectMovies,
  selectIsLoading,
  selectHasError,
  selectError,
} from '../store';

export interface MovieGridState {
  movies: ReturnType<typeof selectMovies>;
  isLoading: boolean;
  hasError: boolean;
  error: string | null;
  isEmpty: boolean;
}

/**
 * Hook that provides movie grid state from Redux store.
 */
export function useMovieGrid(): MovieGridState {
  const movies = useAppSelector(selectMovies);
  const isLoading = useAppSelector(selectIsLoading);
  const hasError = useAppSelector(selectHasError);
  const error = useAppSelector(selectError);

  const isEmpty = !isLoading && !hasError && movies.length === 0;

  return {
    movies,
    isLoading,
    hasError,
    error,
    isEmpty,
  };
}
