import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

export const getFavorites = async (): Promise<string[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
};

export const setFavorites = async (favoriteIds: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(favoriteIds)
    );
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

export const addFavoriteToStorage = async (productId: string): Promise<void> => {
  const favorites = await getFavorites();
  if (!favorites.includes(productId)) {
    favorites.push(productId);
    await setFavorites(favorites);
  }
};

export const removeFavoriteFromStorage = async (
  productId: string
): Promise<void> => {
  const favorites = await getFavorites();
  const filtered = favorites.filter((id) => id !== productId);
  await setFavorites(filtered);
};

export const clearFavoritesFromStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
};

