/**
 * Movies Module Utilities
 */

import { TMDB_ENDPOINTS } from '@/core/api';
import { APP_VIEW } from '@/shared/constants';
import type { AppView } from '@/shared/types';
import { MOVIE_LIST } from '../constants';
import type { MovieList, TmdbMovie, TmdbMovieListResponse, MoviesPage } from '../types';

/**
 * Maps an app view to its movie list type.
 * Returns null for views without a movie list (e.g., favorites).
 */
export function getViewList(view: AppView): MovieList | null {
  if (view === APP_VIEW.POPULAR) return MOVIE_LIST.POPULAR;
  if (view === APP_VIEW.NOW_PLAYING) return MOVIE_LIST.NOW_PLAYING;
  return null;
}

/**
 * Maps movie list type to its API endpoint
 */
export function getListEndpoint(list: MovieList): string {
  switch (list) {
    case MOVIE_LIST.POPULAR:
      return TMDB_ENDPOINTS.MOVIES.POPULAR;
    case MOVIE_LIST.NOW_PLAYING:
      return TMDB_ENDPOINTS.MOVIES.NOW_PLAYING;
  }
}

/**
 * Maps a TMDB API response to a MoviesPage domain object
 */
export function mergeMovies(existing: TmdbMovie[], incoming: TmdbMovie[]): TmdbMovie[] {
  const ids = new Set(existing.map((m) => m.id));
  return [...existing, ...incoming.filter((m) => !ids.has(m.id))];
}

export function toMoviesPage(response: TmdbMovieListResponse): MoviesPage {
  return {
    movies: response.results,
    pageNumber: response.page,
    numberOfPages: response.total_pages,
  };
}
