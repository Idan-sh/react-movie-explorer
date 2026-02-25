/**
 * useMovieGrid Hook
 *
 * Provides data, state, and pagination controls for MovieGrid component.
 * Accepts a list type and section index to manage the correct data from store.
 *
 * SCROLL BEHAVIOR:
 * After "Load More" adds new movies, scrolls the first new card
 * into view smoothly using its data-nav-id attribute.
 */

import { useCallback, useRef, useEffect } from "react";
import { useAppSelector } from "@/core/store";
import { buildNavId, NAV_ID_PREFIX } from "@/modules/navigation";
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

  // Shared load-more dispatch logic
  const loadMore = useLoadMore(list);

  // Track scroll target: index of the first card in the new batch
  const scrollTargetRef = useRef<number | null>(null);

  const handleLoadMore = useCallback((): void => {
    scrollTargetRef.current = movies.length;
    loadMore();
  }, [movies.length, loadMore]);

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
