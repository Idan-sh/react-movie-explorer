/**
 * useLoadMore Hook
 *
 * Dispatches the next page load for a given movie list.
 * Uses prefetched buffer when available, falls back to regular fetch.
 * Scrolls the first new card into view after movies render.
 *
 * Shared between useMovieGrid (button click) and page-level
 * keyboard navigation (Enter on footer).
 */

import { useCallback, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/core/store";
import { buildNavId, NAV_ID_PREFIX } from "@/modules/navigation";
import type { MovieList } from "../types";
import { getListSelectors, fetchMovies, showNextPage } from "../store";

/**
 * Returns a stable callback that loads the next page for a movie list.
 * After new movies render, scrolls the first new card into view.
 */
export function useLoadMore(list: MovieList, sectionIndex: number = 0): () => void {
  const dispatch = useAppDispatch();
  const selectors = getListSelectors(list);

  const movies = useAppSelector(selectors.selectMovies);
  const pageNumber = useAppSelector(selectors.selectPageNumber);
  const isLoading = useAppSelector(selectors.selectIsLoading);
  const hasMorePages = useAppSelector(selectors.selectHasMorePages);
  const hasNextPage = useAppSelector(selectors.selectHasNextPage);

  // Track scroll target: index of the first card in the new batch
  const scrollTargetRef = useRef<number | null>(null);

  const loadMore = useCallback((): void => {
    scrollTargetRef.current = movies.length;
    if (hasNextPage) {
      dispatch(showNextPage({ list }));
    } else if (hasMorePages && !isLoading) {
      dispatch(fetchMovies({ list, pageNumber: pageNumber + 1 }));
    }
  }, [dispatch, list, movies.length, hasNextPage, hasMorePages, isLoading, pageNumber]);

  // After new movies render, scroll the first new card into view.
  // Deferred by one frame so this runs AFTER useKeyboardNav's DOM focus
  // sync effect (which also calls scrollIntoView with block:"nearest").
  useEffect(() => {
    if (scrollTargetRef.current === null) return;
    if (movies.length <= scrollTargetRef.current) return;

    const navId = buildNavId(NAV_ID_PREFIX.ITEM, sectionIndex, scrollTargetRef.current);
    scrollTargetRef.current = null;

    const frameId = requestAnimationFrame(() => {
      document.querySelector(`[data-nav-id="${navId}"]`)?.scrollIntoView({
        block: "start",
        behavior: "smooth"
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [movies.length, sectionIndex]);

  return loadMore;
}
