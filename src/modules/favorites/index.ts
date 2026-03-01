/**
 * Favorites Module - Public API
 */

// Components
export { FavoritesGrid } from './components';
export type { FavoritesGridProps } from './components';

// Hooks
export { useFavoriteToggle } from './hooks';

// Store: reducer + saga for root store
export { favoritesReducer, favoritesSaga } from './store';

// Store: selectors
export { selectFavorites, selectFavoriteIds } from './store';
