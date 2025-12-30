import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import favoritesReducer from './slices/favoritesSlice';
import cartReducer from './slices/cartSlice';
import { saveFavorites } from './slices/favoritesSlice';
import { saveCart } from './slices/cartSlice';
import type { CartItem } from '../types';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'favorites/saveFavorites/fulfilled',
          'cart/saveCart/fulfilled',
        ],
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

// Auto-save cart to AsyncStorage when it changes
let previousCart: CartItem[] = [];

store.subscribe(() => {
  const state = store.getState();
  const currentCart = state.cart.items;

  if (
    state.cart.hydrated &&
    JSON.stringify(previousCart) !== JSON.stringify(currentCart)
  ) {
    previousCart = [...currentCart];
    store.dispatch(saveCart(currentCart));
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

export {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  loadCart,
  saveCart,
  selectCartItems,
  selectCartItemCount,
  selectCartItemById,
  selectIsInCart,
  selectCartHydrated,
} from './slices/cartSlice';
