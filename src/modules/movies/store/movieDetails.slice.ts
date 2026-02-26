/**
 * Movie Details Slice
 *
 * Manages state for the movie details page.
 *
 * FLOW:
 * 1. MovieDetailsPage mounts, reads :id from URL
 * 2. Dispatches fetchMovieDetails({ id })
 * 3. Saga calls /movie/{id}, dispatches fetchDetailsSuccess or fetchDetailsFailure
 * 4. Page unmount dispatches clearMovieDetails
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { REQUEST_STATUS, SLICE_NAMES } from '@/shared/constants';
import type { TmdbMovieDetails, MovieDetailsState } from '../types';

const initialState: MovieDetailsState = {
  details: null,
  status: REQUEST_STATUS.IDLE,
  error: null,
};

const movieDetailsSlice = createSlice({
  name: SLICE_NAMES.MOVIE_DETAILS,
  initialState,
  reducers: {
    /** Start fetching full details for a movie by id */
    fetchMovieDetails: (state, _action: PayloadAction<{ id: number }>) => {
      state.details = null;
      state.status = REQUEST_STATUS.LOADING;
      state.error = null;
    },

    /** Clear details state when leaving the page */
    clearMovieDetails: () => initialState,

    /** Full details arrived from API */
    fetchDetailsSuccess: (state, action: PayloadAction<TmdbMovieDetails>) => {
      state.details = action.payload;
      state.status = REQUEST_STATUS.SUCCESS;
    },

    /** API fetch failed */
    fetchDetailsFailure: (state, action: PayloadAction<string>) => {
      state.status = REQUEST_STATUS.ERROR;
      state.error = action.payload;
    },
  },
});

export const {
  fetchMovieDetails,
  clearMovieDetails,
  fetchDetailsSuccess,
  fetchDetailsFailure,
} = movieDetailsSlice.actions;

export const movieDetailsReducer = movieDetailsSlice.reducer;
