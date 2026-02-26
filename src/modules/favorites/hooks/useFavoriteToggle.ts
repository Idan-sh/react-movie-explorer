/**
 * useFavoriteToggle Hook
 *
 * Returns a stable callback to add or remove a movie from favorites.
 * The slice handles both Redux state update and localStorage persistence.
 */

import { useCallback } from 'react';
import { useAppDispatch } from '@/core/store';
import type { TmdbMovie } from '@/modules/movies';
import { toggleFavorite } from '../store';

export function useFavoriteToggle(): (movie: TmdbMovie) => void {
  const dispatch = useAppDispatch();

  return useCallback(
    (movie: TmdbMovie): void => {
      dispatch(toggleFavorite(movie));
    },
    [dispatch]
  );
}
