/**
 * Search Slice
 *
 * Manages state for movie search results.
 *
 * FLOW:
 * 1. User types → dispatch(setSearchQuery(query))
 * 2. Saga debounces 500ms, checks min length + rate limit
 * 3. Saga dispatches searchMoviesStart → loading indicator appears
 * 4. API responds → searchMoviesSuccess / searchMoviesFailure
 * 5. Page 1: replaces results. Page > 1: appends (Load More).
 * 6. User clears input → dispatch(clearSearch()) resets everything
 */

import { createSlice, createAction, type PayloadAction } from '@reduxjs/toolkit';
import { REQUEST_STATUS, SLICE_NAMES } from '@/shared/constants';
import type { SearchState, SearchSuccessPayload, SearchFailurePayload } from '../types';

const initialState: SearchState = {
  query: '',
  results: [],
  page: 0,
  totalPages: 0,
  status: REQUEST_STATUS.IDLE,
  error: null,
};

const searchSlice = createSlice({
  name: SLICE_NAMES.SEARCH,
  initialState,
  reducers: {
    /** Updates the query string — watched by saga with 500ms debounce */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },

    /** Dispatched by saga just before the API call */
    searchMoviesStart: (state) => {
      state.status = REQUEST_STATUS.LOADING;
      state.error = null;
    },

    /** Page 1: replaces results (new query). Page > 1: appends (load more). */
    searchMoviesSuccess: (state, action: PayloadAction<SearchSuccessPayload>) => {
      const { results, page, totalPages } = action.payload;
      state.status = REQUEST_STATUS.SUCCESS;
      state.page = page;
      state.totalPages = totalPages;

      const existing = page === 1 ? [] : state.results;
      const existingIds = new Set(existing.map((m) => m.id));
      state.results = [...existing, ...results.filter((m) => !existingIds.has(m.id))];
    },

    searchMoviesFailure: (state, action: PayloadAction<SearchFailurePayload>) => {
      state.status = REQUEST_STATUS.ERROR;
      state.error = action.payload.error;
    },

    /** Resets all search state — called when user clears the input */
    clearSearch: () => initialState,
  },
});

/** Saga-only trigger — fetches the next page of the current query */
export const loadMoreSearchResults = createAction(`${SLICE_NAMES.SEARCH}/loadMore`);

export const {
  setSearchQuery,
  searchMoviesStart,
  searchMoviesSuccess,
  searchMoviesFailure,
  clearSearch,
} = searchSlice.actions;

export const searchReducer = searchSlice.reducer;
