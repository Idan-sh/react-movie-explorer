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
  handleChange: (value: string) => void;
  handleClear: () => void;
}

export function useSearch(): UseSearchReturn {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectSearchQuery);

  const handleChange = useCallback((value: string): void => {
    if (value === '') {
      dispatch(clearSearch());
    } else {
      dispatch(setSearchQuery(value));
    }
  }, [dispatch]);

  const handleClear = useCallback((): void => {
    dispatch(clearSearch());
  }, [dispatch]);

  return { query, handleChange, handleClear };
}
