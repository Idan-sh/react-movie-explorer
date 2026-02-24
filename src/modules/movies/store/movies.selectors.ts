/**
 * Movies Selectors
 *
 * Functions to read movies state from the store.
 *
 * WHY SELECTORS:
 * - Encapsulate state shape (if state structure changes, only update here)
 * - Memoization prevents unnecessary re-renders
 * - Reusable across components
 *
 * USAGE:
 * const movies = useAppSelector(selectMovies);
 * const isLoading = useAppSelector(selectMoviesLoading);
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/core/store';
import { REQUEST_STATUS, SLICE_NAMES } from '@/shared/constants';

/**
 * Base selector - gets the movies slice
 */
const selectMoviesState = (state: RootState) => state[SLICE_NAMES.MOVIES];

/**
 * Select movies array
 */
export const selectMovies = createSelector(
  [selectMoviesState],
  (moviesState) => moviesState.movies
);

/**
 * Select current category
 */
export const selectCategory = createSelector(
  [selectMoviesState],
  (moviesState) => moviesState.category
);

/**
 * Select current page
 */
export const selectPage = createSelector(
  [selectMoviesState],
  (moviesState) => moviesState.page
);

/**
 * Select total pages
 */
export const selectTotalPages = createSelector(
  [selectMoviesState],
  (moviesState) => moviesState.totalPages
);

/**
 * Select request status
 */
export const selectStatus = createSelector(
  [selectMoviesState],
  (moviesState) => moviesState.status
);

/**
 * Select error message
 */
export const selectError = createSelector(
  [selectMoviesState],
  (moviesState) => moviesState.error
);

/**
 * Derived selector - is loading
 */
export const selectIsLoading = createSelector(
  [selectStatus],
  (status) => status === REQUEST_STATUS.LOADING
);

/**
 * Derived selector - has error
 */
export const selectHasError = createSelector(
  [selectStatus],
  (status) => status === REQUEST_STATUS.ERROR
);

/**
 * Derived selector - has more pages
 */
export const selectHasMorePages = createSelector(
  [selectPage, selectTotalPages],
  (page, totalPages) => page < totalPages
);
