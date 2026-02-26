/**
 * Favorites Storage Service
 *
 * Handles reading and writing favorites to localStorage.
 * Wraps in try/catch to handle private browsing or storage full errors.
 */

import type { TmdbMovie } from '@/modules/movies';

const STORAGE_KEY = 'movie-explorer-favorites';

export function loadFavorites(): TmdbMovie[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TmdbMovie[]) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(movies: TmdbMovie[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  } catch {
    // Silent fail — private browsing or storage quota exceeded
  }
}
