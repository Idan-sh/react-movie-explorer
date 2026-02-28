/**
 * LocalStorage Key Registry
 *
 * Single source of truth for all localStorage keys used in the app.
 * Prevents key collisions and makes it easy to find where each is defined.
 */

export const STORAGE_KEY = {
  THEME: 'theme',
  FAVORITES: 'movie-explorer-favorites',
} as const;
