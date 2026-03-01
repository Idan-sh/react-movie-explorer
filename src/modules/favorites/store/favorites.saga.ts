/**
 * Favorites Saga
 *
 * Hydrates movie data for favorite IDs on app start.
 * Fetches each movie individually from the TMDB details endpoint.
 */

import { call, put, select, all } from 'redux-saga/effects';
import type { AxiosResponse } from 'axios';
import { tmdbClient } from '@/core/api/tmdbClient';
import { TMDB_ENDPOINTS } from '@/core/api/endpoints';
import type { TmdbMovie } from '@/modules/movies';
import { selectFavoriteIds } from './favorites.selectors';
import { hydrateFavoriteMovies } from './favorites.slice';

function fetchMovieById(id: number): Promise<AxiosResponse<TmdbMovie>> {
  return tmdbClient.get(TMDB_ENDPOINTS.MOVIES.DETAILS(id));
}

function* hydrateFavorites(): Generator {
  const ids = (yield select(selectFavoriteIds)) as number[];
  if (ids.length === 0) return;

  const results = (yield all(
    ids.map((id) => call(fetchSafe, id)),
  )) as (TmdbMovie | null)[];

  const movies = results.filter((m): m is TmdbMovie => m !== null);
  if (movies.length > 0) {
    yield put(hydrateFavoriteMovies(movies));
  }
}

function* fetchSafe(id: number): Generator {
  try {
    const response = (yield call(fetchMovieById, id)) as AxiosResponse<TmdbMovie>;
    return response.data;
  } catch {
    return null;
  }
}

export function* favoritesSaga(): Generator {
  yield call(hydrateFavorites);
}
