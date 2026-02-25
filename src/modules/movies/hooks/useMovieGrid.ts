/**
 * useMovieGrid Hook
 *
 * Provides data and state for MovieGrid component.
 * Accepts a list type to select the correct data from store.
 */

import { useAppSelector } from '@/core/store';
import type { MovieList, TmdbMovie } from '../types';
import { getListSelectors } from '../store';

export interface MovieGridState {
  movies: TmdbMovie[];
  isLoading: boolean;
  hasError: boolean;
  error: string | null;
  isEmpty: boolean;
}

/**
 * Hook that provides movie grid state for a specific list type.
 */
export function useMovieGrid(list: MovieList): MovieGridState {
  const selectors = getListSelectors(list);

  const movies = useAppSelector(selectors.selectMovies);
  const isLoading = useAppSelector(selectors.selectIsLoading);
  const hasError = useAppSelector(selectors.selectHasError);
  const error = useAppSelector(selectors.selectError);

  const isEmpty = !isLoading && !hasError && movies.length === 0;

  return {
    movies,
    isLoading,
    hasError,
    error,
    isEmpty,
  };
}
