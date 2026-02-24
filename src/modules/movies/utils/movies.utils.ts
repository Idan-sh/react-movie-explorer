/**
 * Movies Module Utilities
 */

import { TMDB_ENDPOINTS } from '@/core/api';
import { MOVIE_CATEGORY } from '../constants';
import type { MovieCategory } from '../types';

/**
 * Maps movie category to its API endpoint
 */
export const getCategoryEndpoint = (category: MovieCategory): string => {
  switch (category) {
    case MOVIE_CATEGORY.POPULAR:
      return TMDB_ENDPOINTS.MOVIES.POPULAR;
    case MOVIE_CATEGORY.NOW_PLAYING:
      return TMDB_ENDPOINTS.MOVIES.NOW_PLAYING;
  }
};
