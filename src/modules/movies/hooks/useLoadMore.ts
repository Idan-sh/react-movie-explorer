/**
 * useLoadMore Hook
 *
 * Dispatches the next page load for a given movie list.
 * Uses prefetched buffer when available, falls back to regular fetch.
 *
 * Shared between useMovieGrid (button click) and page-level
 * keyboard navigation (Enter on footer).
 */

import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/core/store";
import type { MovieList } from "../types";
import { getListSelectors, fetchMovies, showNextPage } from "../store";

/**
 * Returns a stable callback that loads the next page for a movie list.
 */
export function useLoadMore(list: MovieList): () => void {
  const dispatch = useAppDispatch();
  const selectors = getListSelectors(list);

  const pageNumber = useAppSelector(selectors.selectPageNumber);
  const isLoading = useAppSelector(selectors.selectIsLoading);
  const hasMorePages = useAppSelector(selectors.selectHasMorePages);
  const hasNextPage = useAppSelector(selectors.selectHasNextPage);

  return useCallback((): void => {
    if (hasNextPage) {
      dispatch(showNextPage({ list }));
    } else if (hasMorePages && !isLoading) {
      dispatch(fetchMovies({ list, pageNumber: pageNumber + 1 }));
    }
  }, [dispatch, list, hasNextPage, hasMorePages, isLoading, pageNumber]);
}
