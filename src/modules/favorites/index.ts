/**
 * Favorites Module - Public API
 */

// Components
export { FavoritesGrid } from './components';
export type { FavoritesGridProps } from './components';

// Hooks
export { useFavoriteToggle } from './hooks';

// Store: reducer for root store
export { favoritesReducer } from './store';

// Store: selectors
export { selectFavorites } from './store';
