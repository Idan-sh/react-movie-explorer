/**
 * Redux Slice Names
 *
 * Centralized slice names to avoid magic strings.
 * Used in createSlice() and for action type prefixes.
 */

export const SLICE_NAMES = {
  MOVIES: 'movies',
  SEARCH: 'search',
  FAVORITES: 'favorites',
} as const;
