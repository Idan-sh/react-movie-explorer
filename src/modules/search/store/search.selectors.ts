/**
 * Search Selectors
 *
 * Memoized selectors for the search slice.
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/core/store';
import { REQUEST_STATUS, SLICE_NAMES } from '@/shared/constants';
import { SEARCH } from '../constants';

const selectSearchState = (state: RootState) => state[SLICE_NAMES.SEARCH];

export const selectSearchQuery = createSelector(
  [selectSearchState],
  (s) => s.query,
);

export const selectSearchResults = createSelector(
  [selectSearchState],
  (s) => s.results,
);

export const selectSearchPage = createSelector(
  [selectSearchState],
  (s) => s.page,
);

export const selectSearchIsLoading = createSelector(
  [selectSearchState],
  (s) => s.status === REQUEST_STATUS.LOADING,
);

export const selectSearchIsIdle = createSelector(
  [selectSearchState],
  (s) => s.status === REQUEST_STATUS.IDLE,
);

export const selectSearchHasError = createSelector(
  [selectSearchState],
  (s) => s.status === REQUEST_STATUS.ERROR,
);

export const selectSearchError = createSelector(
  [selectSearchState],
  (s) => s.error,
);

export const selectSearchHasMorePages = createSelector(
  [selectSearchState],
  (s) => s.page > 0 && s.page < s.totalPages,
);

/** True when the query (trimmed) meets the minimum length to trigger a search */
export const selectSearchIsActive = createSelector(
  [selectSearchQuery],
  (query) => query.trim().length >= SEARCH.MIN_QUERY_LENGTH,
);

export const selectSearchResultCount = (state: RootState): number =>
  selectSearchResults(state).length;

/** True when a next page can be fetched */
export const selectSearchCanLoad = createSelector(
  [selectSearchHasMorePages, selectSearchIsLoading],
  (hasMore, isLoading) => hasMore && !isLoading,
);
