/**
 * Movie Details Selectors
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/core/store';
import { REQUEST_STATUS, SLICE_NAMES } from '@/shared/constants';

const selectMovieDetailsState = (state: RootState) => state[SLICE_NAMES.MOVIE_DETAILS];

export const selectMovieDetails = createSelector(
  [selectMovieDetailsState],
  (s) => s.details
);

export const selectDetailsIsLoading = createSelector(
  [selectMovieDetailsState],
  (s) => s.status === REQUEST_STATUS.LOADING
);

export const selectDetailsError = createSelector(
  [selectMovieDetailsState],
  (s) => s.error
);
