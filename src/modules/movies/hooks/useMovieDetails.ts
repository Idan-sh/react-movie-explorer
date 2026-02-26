/**
 * useMovieDetails Hook
 *
 * Fetches full movie details for the MovieDetailsPage.
 * Dispatches fetchMovieDetails on mount and clearMovieDetails on unmount.
 */

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store';
import { fetchMovieDetails, clearMovieDetails, selectMovieDetails, selectDetailsIsLoading, selectDetailsError } from '../store';
import type { TmdbMovieDetails } from '../types';

export interface UseMovieDetailsReturn {
  details: TmdbMovieDetails | null;
  isLoading: boolean;
  error: string | null;
}

export function useMovieDetails(id: number): UseMovieDetailsReturn {
  const dispatch = useAppDispatch();
  const details = useAppSelector(selectMovieDetails);
  const isLoading = useAppSelector(selectDetailsIsLoading);
  const error = useAppSelector(selectDetailsError);

  useEffect(() => {
    dispatch(fetchMovieDetails({ id }));
    return () => { dispatch(clearMovieDetails()); };
  }, [dispatch, id]);

  return { details, isLoading, error };
}
