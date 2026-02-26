/**
 * useMoviesInit Hook
 *
 * Lazy-loads movie data for the active view tab.
 * Only fetches when a tab is first opened (status is idle).
 */

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store';
import type { AppView } from '@/shared/types';
import { fetchMovies, getListSelectors } from '../store';
import { PAGINATION } from '../constants';
import type { MovieList } from '../types';
import { getViewList } from '../utils';

export interface UseMoviesInitReturn {
  activeList: MovieList | null;
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

  return { activeList };
}
