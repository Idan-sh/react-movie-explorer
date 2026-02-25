/**
 * Movies Slice
 *
 * Manages state for movie listings (popular, now playing).
 * State is keyed by list type to support multiple lists simultaneously.
 *
 * FLOW:
 * 1. Component dispatches fetchMovies({ list, page })
 * 2. Saga intercepts, calls API
 * 3. Saga dispatches fetchMoviesSuccess or fetchMoviesFailure
 * 4. Reducer updates the correct list's state
 * 5. Component re-renders with new data
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { REQUEST_STATUS, SLICE_NAMES } from '@/shared/constants';
import { MOVIE_LIST_STATE_KEY, PAGINATION } from '../constants';
import type {
  MoviesState,
  MovieListState,
  FetchMoviesPayload,
  FetchMoviesSuccessPayload,
  FetchMoviesFailurePayload,
} from '../types';

/**
 * Default state for a single movie list
 */
const initialListState: MovieListState = {
  movies: [],
  page: PAGINATION.DEFAULT_PAGE,
  totalPages: 0,
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
      state[key].page = action.payload.page;
    },

    /**
     * Called by saga on successful API response
     */
    fetchMoviesSuccess: (state, action: PayloadAction<FetchMoviesSuccessPayload>) => {
      const key = MOVIE_LIST_STATE_KEY[action.payload.list];
      state[key].status = REQUEST_STATUS.SUCCESS;
      state[key].movies = action.payload.movies;
      state[key].page = action.payload.page;
      state[key].totalPages = action.payload.totalPages;
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
     * Reset to initial state
     */
    resetMovies: () => initialState,
  },
});

export const {
  fetchMovies,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  resetMovies,
} = moviesSlice.actions;

export const moviesReducer = moviesSlice.reducer;
