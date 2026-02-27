/**
 * Root Reducer
 *
 * Combines all feature slices into a single reducer.
 *
 * HOW IT WORKS:
 * - Each module has its own slice (e.g., moviesSlice, searchSlice)
 * - combineReducers merges them into one state tree
 * - State shape: { movies: {...}, search: {...}, favorites: {...} }
 *
 * ADDING A NEW SLICE:
 * 1. Create slice in module: modules/example/store/example.slice.ts
 * 2. Import reducer and add to combineReducers below
 */

import { combineReducers } from '@reduxjs/toolkit';
import { SLICE_NAMES } from '@/shared/constants';
import { moviesReducer, movieDetailsReducer } from '@/modules/movies/store';
import { favoritesReducer } from '@/modules/favorites/store';
import { searchReducer } from '@/modules/search/store';

export const rootReducer = combineReducers({
  [SLICE_NAMES.MOVIES]: moviesReducer,
  [SLICE_NAMES.MOVIE_DETAILS]: movieDetailsReducer,
  [SLICE_NAMES.FAVORITES]: favoritesReducer,
  [SLICE_NAMES.SEARCH]: searchReducer,
});
