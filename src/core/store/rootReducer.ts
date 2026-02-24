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
import { moviesReducer } from '@/modules/movies/store';

export const rootReducer = combineReducers({
  [SLICE_NAMES.MOVIES]: moviesReducer,
});
