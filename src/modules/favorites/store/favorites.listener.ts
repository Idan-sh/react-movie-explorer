import { listenerMiddleware } from '@/core/store';
import type { RootState } from '@/core/store';
import { saveFavoriteIds } from '../services/favorites.storage';
import { toggleFavorite } from './favorites.slice';

listenerMiddleware.startListening({
  actionCreator: toggleFavorite,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    saveFavoriteIds(state.favorites.ids);
  },
});
