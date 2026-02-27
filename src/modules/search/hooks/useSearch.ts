/**
 * useSearch Hook
 *
 * Input control hook for SearchBar.
 * Handles query dispatching: setSearchQuery on change, clearSearch on empty/clear.
 * Grid state and load-more are handled separately by useSearchGrid.
 */

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

  const handleChange = (value: string): void => {
    if (value === '') {
      dispatch(clearSearch());
    } else {
      dispatch(setSearchQuery(value));
    }
  };

  const handleClear = (): void => {
    dispatch(clearSearch());
  };

  return { query, handleChange, handleClear };
}
