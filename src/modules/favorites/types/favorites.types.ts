/**
 * Favorites Types
 */

import type { TmdbMovie } from '@/modules/movies';

export interface FavoritesState {
  /** Source of truth — persisted to localStorage */
  ids: number[];
  /** Movie data for rendering — populated from API, NOT persisted */
  movies: TmdbMovie[];
}
