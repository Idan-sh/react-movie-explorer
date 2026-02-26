/**
 * Favorites Slice
 *
 * Manages the list of favorited movies.
 * Initializes from localStorage on app start.
 * Persists to localStorage on every toggle.
 *
 * No saga needed — localStorage operations are synchronous.
 */

import { createSlice, current, type PayloadAction } from '@reduxjs/toolkit';
import { SLICE_NAMES } from '@/shared/constants';
import { loadFavorites, saveFavorites } from '../services/favorites.storage';
import type { FavoritesState } from '../types';
import type { TmdbMovie } from '@/modules/movies';

const initialState: FavoritesState = {
  movies: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: SLICE_NAMES.FAVORITES,
  initialState,
  reducers: {
    /**
     * Add movie if not favorited, remove if already favorited.
     * Persists the updated list to localStorage.
     */
    toggleFavorite: (state, action: PayloadAction<TmdbMovie>) => {
      const movie = action.payload;
      const index = state.movies.findIndex((m) => m.id === movie.id);

      if (index === -1) {
        state.movies.push(movie);
      } else {
        state.movies.splice(index, 1);
      }

      saveFavorites(current(state.movies));
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
