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
