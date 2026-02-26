/**
 * Favorites Selectors
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/core/store';
import { SLICE_NAMES } from '@/shared/constants';

const selectFavoritesState = (state: RootState) => state[SLICE_NAMES.FAVORITES];

export const selectFavorites = createSelector(
  [selectFavoritesState],
  (state) => state.movies
);

