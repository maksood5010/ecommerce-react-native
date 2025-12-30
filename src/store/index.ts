import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import favoritesReducer from './slices/favoritesSlice';
import { saveFavorites } from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['favorites/saveFavorites/fulfilled'],
      },
    }),
});

// Auto-save favorites to AsyncStorage when they change
let previousFavorites: string[] = [];

store.subscribe(() => {
  const state = store.getState();
  const currentFavorites = state.favorites.ids;

  if (
    state.favorites.hydrated &&
    JSON.stringify(previousFavorites) !== JSON.stringify(currentFavorites)
  ) {
    previousFavorites = [...currentFavorites];
    store.dispatch(saveFavorites(currentFavorites));
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export { useAppDispatch, useAppSelector, useAppStore } from './hooks';

export {
  fetchProducts,
  clearError,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductById,
} from './slices/productsSlice';

export {
  toggleFavorite,
  addFavorite,
  removeFavorite,
  clearFavorites,
  loadFavorites,
  saveFavorites,
  selectFavoriteIds,
  selectIsFavorite,
  selectFavoritesHydrated,
  selectFavoritesCount,
} from './slices/favoritesSlice';
