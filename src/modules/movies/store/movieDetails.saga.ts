/**
 * Movie Details Saga
 *
 * Fetches full movie details when MovieDetailsPage mounts.
 *
 * Uses takeLatest so rapid navigation between detail pages cancels
 * in-flight requests — only the last movie's details arrive.
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { tmdbClient } from '@/core/api';
import { TMDB_ENDPOINTS } from '@/core/api/endpoints';
import type { TmdbMovieDetails } from '../types';
import { MOVIE_DETAILS_APPEND } from '../constants';
import { fetchMovieDetails, fetchDetailsSuccess, fetchDetailsFailure } from './movieDetails.slice';

function* fetchMovieDetailsSaga(action: PayloadAction<{ id: number }>): Generator {
  try {
    const response = yield call(
      tmdbClient.get<TmdbMovieDetails>,
      TMDB_ENDPOINTS.MOVIES.DETAILS(action.payload.id),
      { params: { append_to_response: MOVIE_DETAILS_APPEND } }
    );
    yield put(fetchDetailsSuccess((response as { data: TmdbMovieDetails }).data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch movie details';
    yield put(fetchDetailsFailure(message));
  }
}

export function* movieDetailsSaga(): Generator {
  yield takeLatest(fetchMovieDetails.type, fetchMovieDetailsSaga);
}
