import { listenerMiddleware } from '@/core/store';
import type { RootState } from '@/core/store';
import { saveFavorites } from '../services/favorites.storage';
import { toggleFavorite } from './favorites.slice';

listenerMiddleware.startListening({
  actionCreator: toggleFavorite,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    saveFavorites(state.favorites.movies);
  },
});
