/**
 * Favorites Slice
 *
 * Manages favorited movie IDs (source of truth) and cached movie data (for rendering).
 * IDs are persisted to localStorage via listener middleware.
 * Movie data is populated on toggle (immediate) and hydrated on app start (from API).
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SLICE_NAMES } from '@/shared/constants';
import { loadFavoriteIds } from '../services/favorites.storage';
import type { FavoritesState } from '../types';
import type { TmdbMovie } from '@/modules/movies';

const initialState: FavoritesState = {
  ids: loadFavoriteIds(),
  movies: [],
};

const favoritesSlice = createSlice({
  name: SLICE_NAMES.FAVORITES,
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<TmdbMovie>) => {
      const movie = action.payload;
      const idIndex = state.ids.indexOf(movie.id);

      if (idIndex === -1) {
        state.ids.push(movie.id);
        state.movies.push(movie);
      } else {
        state.ids.splice(idIndex, 1);
        const movieIndex = state.movies.findIndex((m) => m.id === movie.id);
        if (movieIndex !== -1) state.movies.splice(movieIndex, 1);
      }
    },
    hydrateFavoriteMovies: (state, action: PayloadAction<TmdbMovie[]>) => {
      for (const movie of action.payload) {
        if (!state.movies.some((m) => m.id === movie.id)) {
          state.movies.push(movie);
        }
      }
    },
  },
});

export const { toggleFavorite, hydrateFavoriteMovies } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
