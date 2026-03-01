/**
 * Favorites Storage Service
 *
 * Handles reading and writing favorites to localStorage.
 * Wraps in try/catch to handle private browsing or storage full errors.
 */

import type { TmdbMovie } from "@/modules/movies";
import { STORAGE_KEY } from "@/shared/constants";

export function loadFavorites(): TmdbMovie[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY.MOVIES.FAVORITES);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TmdbMovie[]) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(movies: TmdbMovie[]): void {
  try {
    localStorage.setItem(STORAGE_KEY.MOVIES.FAVORITES, JSON.stringify(movies));
  } catch {
    // Silent fail — private browsing or storage quota exceeded
  }
}
