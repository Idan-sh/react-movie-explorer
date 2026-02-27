/**
 * Search Module - Public API
 */

// Components
export { SearchBar } from './components';
export type { SearchBarProps } from './components';

// Hooks
export { useSearch, useSearchGrid } from './hooks';
export type { UseSearchReturn, UseSearchGridReturn } from './hooks';

// Store: reducer + saga for root store
export { searchReducer, searchSagaRoot } from './store';

// Store: selectors
export {
  selectSearchQuery,
  selectSearchResults,
  selectSearchIsLoading,
  selectSearchHasError,
  selectSearchError,
  selectSearchHasMorePages,
  selectSearchIsActive,
} from './store';
