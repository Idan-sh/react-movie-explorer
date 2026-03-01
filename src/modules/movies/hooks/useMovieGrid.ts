/**
 * useMovieGrid Hook
 *
 * Thin data hook for MovieGrid.
 * Reads movie list state from Redux and delegates load-more + scroll
 * to the shared useLoadMore hook.
 */

import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/core/store';
import { useLoadMore } from '@/shared/hooks';
import type { MovieList, MovieGridState } from '../types';
import { getListSelectors, fetchMovies, showNextPage } from '../store';

export function useMovieGrid(
  list: MovieList,
  sectionIndex: number,
): MovieGridState {
  const dispatch = useAppDispatch();
  const selectors = getListSelectors(list);

  const movies = useAppSelector(selectors.selectMovies);
  const isLoading = useAppSelector(selectors.selectIsLoading);
  const hasError = useAppSelector(selectors.selectHasError);
  const error = useAppSelector(selectors.selectError);
  const hasMorePages = useAppSelector(selectors.selectHasMorePages);
  const hasNextPage = useAppSelector(selectors.selectHasNextPage);
  const pageNumber = useAppSelector(selectors.selectPageNumber);

  const onLoad = useCallback((): void => {
    if (hasNextPage) dispatch(showNextPage({ list }));
    else dispatch(fetchMovies({ list, pageNumber: pageNumber + 1 }));
  }, [dispatch, list, hasNextPage, pageNumber]);

  const handleLoadMore = useLoadMore({
    itemCountSelector: selectors.selectMovieCount,
    canLoadSelector: selectors.selectCanLoad,
    onLoad,
    sectionIndex,
  });

  return {
    movies,
    isLoading,
    isLoadingMore: isLoading && movies.length > 0,
    hasError,
    error,
    isEmpty: !isLoading && !hasError && movies.length === 0,
    hasMorePages,
    handleLoadMore,
  };
}
