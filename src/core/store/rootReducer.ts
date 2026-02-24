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

// Import reducers from modules as they are created
// import { moviesReducer } from '@/modules/movies/store';
// import { searchReducer } from '@/modules/search/store';
// import { favoritesReducer } from '@/modules/favorites/store';

// Combine all reducers
export const rootReducer = combineReducers({
  // Placeholder until we add real slices
  // Remove this when adding first real reducer
  _placeholder: (state: null = null) => state,

  // Add reducers here as modules are created:
  // movies: moviesReducer,
  // search: searchReducer,
  // favorites: favoritesReducer,
});
