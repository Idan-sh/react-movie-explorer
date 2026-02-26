/**
 * Favorites Types
 */

import type { TmdbMovie } from '@/modules/movies';

export interface FavoritesState {
  movies: TmdbMovie[];
}

