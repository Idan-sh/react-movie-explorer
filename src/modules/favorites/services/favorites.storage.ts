/**
 * Favorites Storage Service
 *
 * Persists only movie IDs to localStorage (not full objects).
 * Movie data is fetched from the API on load.
 */

import { STORAGE_KEY } from '@/shared/constants';

export function loadFavoriteIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY.MOVIES.FAVORITES);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as number[]) : [];
  } catch {
    return [];
  }
}

export function saveFavoriteIds(ids: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY.MOVIES.FAVORITES, JSON.stringify(ids));
  } catch {
    // Silent fail — private browsing or storage quota exceeded
  }
}
