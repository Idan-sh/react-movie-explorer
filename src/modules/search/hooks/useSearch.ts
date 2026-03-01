/**
 * useSearch Hook
 *
 * Input control hook for SearchBar.
 * Handles query dispatching: setSearchQuery on change, clearSearch on empty/clear.
 * Grid state and load-more are handled separately by useSearchGrid.
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store';
import { setSearchQuery, clearSearch, selectSearchQuery } from '../store';

export interface UseSearchReturn {
  query: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
}

export function useSearch(): UseSearchReturn {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectSearchQuery);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value;
      if (value === '') {
        dispatch(clearSearch());
      } else {
        dispatch(setSearchQuery(value));
      }
    },
    [dispatch],
  );

  const handleClear = useCallback((): void => {
    dispatch(clearSearch());
  }, [dispatch]);

  return { query, handleInputChange, handleClear };
}
