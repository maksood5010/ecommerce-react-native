/**
 * useHydrateStorage Hook
 * 
 * Loads persisted data from AsyncStorage on app startup.
 * This includes favorites and cart items.
 * 
 * Usage:
 * ```tsx
 * function App() {
 *   const { isHydrated, isLoading } = useHydrateStorage();
 *   
 *   if (!isHydrated) {
 *     return <SplashScreen />;
 *   }
 *   
 *   return <MainApp />;
 * }
 * ```
 */

import { useEffect } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  loadFavorites,
  loadCart,
  fetchProducts,
  selectFavoritesHydrated,
  selectCartHydrated,
} from '../store';

interface UseHydrateStorageResult {
  isHydrated: boolean;
  isLoading: boolean;
}

export const useHydrateStorage = (): UseHydrateStorageResult => {
  const dispatch = useAppDispatch();
  
  const favoritesHydrated = useAppSelector(selectFavoritesHydrated);
  const cartHydrated = useAppSelector(selectCartHydrated);
  
  const isHydrated = favoritesHydrated && cartHydrated;
  const isLoading = !isHydrated;

  useEffect(() => {
    // Load persisted data on mount
    dispatch(loadFavorites());
    dispatch(loadCart());
    dispatch(fetchProducts());
  }, [dispatch]);

  return {
    isHydrated,
    isLoading,
  };
};

