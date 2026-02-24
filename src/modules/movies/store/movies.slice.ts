/**
 * Movies Slice
 *
 * Manages state for movie listings (popular, now playing).
 *
 * FLOW:
 * 1. Component dispatches fetchMovies({ category, page })
 * 2. Saga intercepts, calls API
 * 3. Saga dispatches fetchMoviesSuccess or fetchMoviesFailure
 * 4. Reducer updates state
 * 5. Component re-renders with new data
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { REQUEST_STATUS, SLICE_NAMES } from '@/shared/constants';
import { MOVIE_CATEGORY, PAGINATION } from '../constants';
import type {
  MoviesState,
  FetchMoviesPayload,
  FetchMoviesSuccessPayload,
  MovieCategory,
} from '../types';

/**
 * Initial state
 */
const initialState: MoviesState = {
  movies: [],
  category: MOVIE_CATEGORY.POPULAR,
  page: PAGINATION.DEFAULT_PAGE,
  totalPages: 0,
  status: REQUEST_STATUS.IDLE,
  error: null,
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
      state.status = REQUEST_STATUS.LOADING;
      state.error = null;
      state.category = action.payload.category;
      state.page = action.payload.page;
    },

    /**
     * Called by saga on successful API response
     */
    fetchMoviesSuccess: (state, action: PayloadAction<FetchMoviesSuccessPayload>) => {
      state.status = REQUEST_STATUS.SUCCESS;
      state.movies = action.payload.movies;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
    },

    /**
     * Called by saga on API error
     */
    fetchMoviesFailure: (state, action: PayloadAction<string>) => {
      state.status = REQUEST_STATUS.ERROR;
      state.error = action.payload;
    },

    /**
     * Change category (triggers fetch via saga)
     */
    setCategory: (state, action: PayloadAction<MovieCategory>) => {
      state.category = action.payload;
      state.page = PAGINATION.DEFAULT_PAGE;
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
  setCategory,
  resetMovies,
} = moviesSlice.actions;

export const moviesReducer = moviesSlice.reducer;
