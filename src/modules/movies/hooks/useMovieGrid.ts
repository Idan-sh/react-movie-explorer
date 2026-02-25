/**
 * useMovieGrid Hook
 *
 * Provides data, state, and pagination controls for MovieGrid component.
 * Reads movie list state from store and derives display flags.
 * Scroll-after-load-more is handled by useLoadMore.
 */

import { useAppSelector } from "@/core/store";
import type { MovieList, TmdbMovie } from "../types";
import { getListSelectors } from "../store";
import { useLoadMore } from "./useLoadMore";

export interface MovieGridState {
  movies: TmdbMovie[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasError: boolean;
  error: string | null;
  isEmpty: boolean;
  hasMorePages: boolean;
  handleLoadMore: () => void;
}

/**
 * Hook that provides movie grid state and pagination for a specific list type.
 */
export function useMovieGrid(list: MovieList, sectionIndex: number): MovieGridState {
  const selectors = getListSelectors(list);

  const movies = useAppSelector(selectors.selectMovies);
  const isLoading = useAppSelector(selectors.selectIsLoading);
  const hasError = useAppSelector(selectors.selectHasError);
  const error = useAppSelector(selectors.selectError);
  const hasMorePages = useAppSelector(selectors.selectHasMorePages);

  const isLoadingMore = isLoading && movies.length > 0;
  const isEmpty = !isLoading && !hasError && movies.length === 0;

  const handleLoadMore = useLoadMore(list, sectionIndex);

  return {
    movies,
    isLoading,
    isLoadingMore,
    hasError,
    error,
    isEmpty,
    hasMorePages,
    handleLoadMore
  };
}
