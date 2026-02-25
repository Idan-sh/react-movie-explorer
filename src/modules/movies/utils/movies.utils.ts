/**
 * Movies Module Utilities
 */

import { TMDB_ENDPOINTS } from '@/core/api';
import { MOVIE_LIST } from '../constants';
import type { MovieList, TmdbMovieListResponse, MoviesPage } from '../types';

/**
 * Maps movie list type to its API endpoint
 */
export const getListEndpoint = (list: MovieList): string => {
  switch (list) {
    case MOVIE_LIST.POPULAR:
      return TMDB_ENDPOINTS.MOVIES.POPULAR;
    case MOVIE_LIST.NOW_PLAYING:
      return TMDB_ENDPOINTS.MOVIES.NOW_PLAYING;
  }
};

/**
 * Maps a TMDB API response to a MoviesPage domain object
 */
export function toMoviesPage(response: TmdbMovieListResponse): MoviesPage {
  return {
    movies: response.results,
    pageNumber: response.page,
    numberOfPages: response.total_pages,
  };
}
