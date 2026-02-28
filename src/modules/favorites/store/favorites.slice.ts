/**
 * Favorites Slice
 *
 * Manages the list of favorited movies.
 * Initializes from localStorage on app start.
 * Persistence handled by favoritesListenerMiddleware (not in reducer).
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SLICE_NAMES } from '@/shared/constants';
import { loadFavorites } from '../services/favorites.storage';
import type { FavoritesState } from '../types';
import type { TmdbMovie } from '@/modules/movies';

const initialState: FavoritesState = {
  movies: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: SLICE_NAMES.FAVORITES,
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<TmdbMovie>) => {
      const movie = action.payload;
      const index = state.movies.findIndex((m) => m.id === movie.id);

      if (index === -1) {
        state.movies.push(movie);
      } else {
        state.movies.splice(index, 1);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
