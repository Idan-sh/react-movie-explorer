/**
 * Movies Slice
 *
 * Manages state for movie listings (popular, now playing).
 * State is keyed by list type to support multiple lists simultaneously.
 *
 * PAGINATION FLOW:
 * 1. Component dispatches fetchMovies({ list, pageNumber: 1 }) → saga fetches page 1
 * 2. fetchMoviesSuccess → page stored, saga silently prefetches page 2
 * 3. prefetchSuccess → next page stored in buffer (nextPage)
 * 4. User clicks "Load More" → showNextPage → buffer applied instantly
 * 5. Saga prefetches page 3 → repeat
 *
 * FALLBACK (slow connection / prefetch not ready):
 * 6. User clicks "Load More" but buffer is empty → fetchMovies({ pageNumber: N+1 })
 * 7. Regular loading flow with skeleton cards
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { REQUEST_STATUS, SLICE_NAMES } from '@/shared/constants';
import { MOVIE_LIST_STATE_KEY, PAGINATION } from '../constants';
import type {
  MoviesState,
  MovieListState,
  MoviesPage,
  FetchMoviesPayload,
  FetchMoviesSuccessPayload,
  FetchMoviesFailurePayload,
  PrefetchSuccessPayload,
  ShowNextPagePayload,
} from '../types';

/**
 * Default page state
 */
const initialPage: MoviesPage = {
  movies: [],
  pageNumber: PAGINATION.DEFAULT_PAGE,
  numberOfPages: 0,
};

/**
 * Default state for a single movie list
 */
const initialListState: MovieListState = {
  page: { ...initialPage },
  nextPage: null,
  status: REQUEST_STATUS.IDLE,
  error: null,
};

/**
 * Initial state - each list type starts with defaults
 */
const initialState: MoviesState = {
  popular: { ...initialListState },
  nowPlaying: { ...initialListState },
};

/**
 * Movies slice
 */
const moviesSlice = createSlice({
  name: SLICE_NAMES.MOVIES,
  initialState,
  reducers: {
    /**
     * Triggers movie fetch - handled by saga
     */
    fetchMovies: (state, action: PayloadAction<FetchMoviesPayload>) => {
      const key = MOVIE_LIST_STATE_KEY[action.payload.list];
      state[key].status = REQUEST_STATUS.LOADING;
      state[key].error = null;
    },

    /**
     * Called by saga on successful API response.
     * Page 1: replaces page (fresh load), clears prefetch buffer.
     * Page > 1: appends movies to current page (fallback load more).
     */
    fetchMoviesSuccess: (state, action: PayloadAction<FetchMoviesSuccessPayload>) => {
      const key = MOVIE_LIST_STATE_KEY[action.payload.list];
      const { page } = action.payload;

      state[key].status = REQUEST_STATUS.SUCCESS;

      if (page.pageNumber === 1) {
        state[key].page = page;
        state[key].nextPage = null;
      } else {
        state[key].page = {
          ...page,
          movies: [...state[key].page.movies, ...page.movies],
        };
      }
    },

    /**
     * Called by saga on API error
     */
    fetchMoviesFailure: (state, action: PayloadAction<FetchMoviesFailurePayload>) => {
      const key = MOVIE_LIST_STATE_KEY[action.payload.list];
      state[key].status = REQUEST_STATUS.ERROR;
      state[key].error = action.payload.error;
    },

    /**
     * Stores prefetched next page data in buffer.
     * Called by saga after silently fetching the next page.
     */
    prefetchSuccess: (state, action: PayloadAction<PrefetchSuccessPayload>) => {
      const key = MOVIE_LIST_STATE_KEY[action.payload.list];
      state[key].nextPage = action.payload.page;
    },

    /**
     * Moves prefetched buffer into visible movies.
     * Triggered by "Load More" click when buffer is ready.
     */
    showNextPage: (state, action: PayloadAction<ShowNextPagePayload>) => {
      const key = MOVIE_LIST_STATE_KEY[action.payload.list];
      const { nextPage } = state[key];
      if (!nextPage) return;

      state[key].page = {
        ...nextPage,
        movies: [...state[key].page.movies, ...nextPage.movies],
      };
      state[key].nextPage = null;
    },

    /**
     * Reset to initial state
     */
    resetMovies: () => initialState,
  },
});

export const {
  fetchMovies,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  prefetchSuccess,
  showNextPage,
  resetMovies,
} = moviesSlice.actions;

export const moviesReducer = moviesSlice.reducer;
