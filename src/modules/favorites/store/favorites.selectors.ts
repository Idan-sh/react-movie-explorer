/**
 * Favorites Selectors
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/core/store';
import { SLICE_NAMES } from '@/shared/constants';

const selectFavoritesState = (state: RootState) => state[SLICE_NAMES.FAVORITES];

/** Movie data for rendering (may be empty before hydration completes) */
export const selectFavorites = createSelector(
  [selectFavoritesState],
  (state) => state.movies,
);

/** IDs only — use for quick "is favorited" checks */
export const selectFavoriteIds = createSelector(
  [selectFavoritesState],
  (state) => state.ids,
);
