/**
 * Movies Saga
 *
 * Handles side effects for movies module:
 * - Fetches movies from TMDB API
 * - Handles errors
 *
 * SAGA EFFECTS:
 * - takeEvery: Allows parallel fetches for different lists
 * - call: Calls async function and waits for result
 * - put: Dispatches Redux action
 */

import { call, put, takeEvery } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { tmdbClient } from '@/core/api';
import type { FetchMoviesPayload, TmdbMovieListResponse } from '../types';
import { getListEndpoint } from '../utils';
import { fetchMovies, fetchMoviesSuccess, fetchMoviesFailure } from './movies.slice';

/**
 * Fetches movies from TMDB API
 */
function* fetchMoviesSaga(action: PayloadAction<FetchMoviesPayload>): Generator {
  try {
    const { list, page } = action.payload;
    const endpoint = getListEndpoint(list);

    const response = yield call(tmdbClient.get<TmdbMovieListResponse>, endpoint, {
      params: { page },
    });

    const data = (response as { data: TmdbMovieListResponse }).data;

    yield put(
      fetchMoviesSuccess({
        list,
        movies: data.results,
        page: data.page,
        totalPages: data.total_pages,
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch movies';
    yield put(fetchMoviesFailure({ list: action.payload.list, error: message }));
  }
}

/**
 * Root saga for movies module
 */
export function* moviesSaga(): Generator {
  yield takeEvery(fetchMovies.type, fetchMoviesSaga);
}
