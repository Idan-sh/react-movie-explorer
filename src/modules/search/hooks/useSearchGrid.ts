/**
 * useSearchGrid Hook
 *
 * Provides MovieGridState for search results.
 * Reads search Redux state and delegates load-more + scroll
 * to the shared useLoadMore hook — same pattern as useMovieGrid.
 */

import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/core/store';
import { useLoadMore } from '@/shared/hooks';
import type { MovieGridState } from '@/modules/movies';
import {
  selectSearchQuery,
  selectSearchResults,
  selectSearchIsLoading,
  selectSearchIsIdle,
  selectSearchHasError,
  selectSearchError,
  selectSearchHasMorePages,
  selectSearchIsActive,
  selectSearchResultCount,
  selectSearchCanLoad,
  loadMoreSearchResults,
} from '../store';

export interface UseSearchGridReturn extends MovieGridState {
  /** True when query meets minimum length — controls search mode display */
  isActive: boolean;
  /** Current query string — for "No results for X" empty state message */
  query: string;
}

export function useSearchGrid(sectionIndex = 0): UseSearchGridReturn {
  const dispatch = useAppDispatch();

  const results   = useAppSelector(selectSearchResults);
  const isLoading = useAppSelector(selectSearchIsLoading);
  const isIdle    = useAppSelector(selectSearchIsIdle);
  const isActive  = useAppSelector(selectSearchIsActive);
  const hasError  = useAppSelector(selectSearchHasError);
  const error        = useAppSelector(selectSearchError);
  const hasMorePages = useAppSelector(selectSearchHasMorePages);
  const query        = useAppSelector(selectSearchQuery);

  // Treat IDLE+active as loading: debounce is in progress, results will arrive soon
  const effectiveIsLoading = isLoading || (isActive && isIdle);

  const onLoad = useCallback((): void => {
    dispatch(loadMoreSearchResults());
  }, [dispatch]);

  const handleLoadMore = useLoadMore({
    itemCountSelector: selectSearchResultCount,
    canLoadSelector:   selectSearchCanLoad,
    onLoad,
    sectionIndex,
  });

  return {
    movies: results,
    isLoading: effectiveIsLoading,
    isLoadingMore: effectiveIsLoading && results.length > 0,
    hasError,
    error,
    isEmpty: !effectiveIsLoading && !hasError && results.length === 0,
    hasMorePages,
    handleLoadMore,
    isActive,
    query,
  };
}
