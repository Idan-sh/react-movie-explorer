/**
 * useMoviesInit Hook
 *
 * Lazy-loads movie data for the active view tab.
 * Only fetches when a tab is first opened (status is idle).
 * Provides selection handler for movie cards.
 */

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store';
import { APP_VIEW } from '@/shared/constants';
import type { AppView } from '@/shared/types';
import { fetchMovies, getListSelectors } from '../store';
import { MOVIE_LIST, PAGINATION } from '../constants';
import type { TmdbMovie, MovieList } from '../types';
import { getViewList } from '../utils';

export interface UseMoviesInitReturn {
  activeList: MovieList | null;
  handleSelectMovie: (movie: TmdbMovie) => void;
}

/**
 * Hook that fetches movie data for the active view when first opened.
 */
export function useMoviesInit(activeView: AppView): UseMoviesInitReturn {
  const dispatch = useAppDispatch();

  const activeList = getViewList(activeView);

  // Only read idle status for movie list views
  const isIdle = useAppSelector(
    activeList ? getListSelectors(activeList).selectIsIdle : () => false
  );

  // Fetch when tab becomes active and data hasn't been loaded yet
  useEffect(() => {
    if (activeList && isIdle) {
      dispatch(fetchMovies({
        list: activeList,
        pageNumber: PAGINATION.DEFAULT_PAGE,
      }));
    }
  }, [dispatch, activeList, isIdle]);

  // Handle movie selection (will navigate to details page later)
  const handleSelectMovie = useCallback((movie: TmdbMovie): void => {
    // TODO: Navigate to movie details page
    console.log('Selected movie:', movie.title);
  }, []);

  return {
    activeList,
    handleSelectMovie,
  };
}
