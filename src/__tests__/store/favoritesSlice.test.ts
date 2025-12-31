/**
 * ============================================
 * FAVORITES SLICE UNIT TESTS
 * ============================================
 * 
 * Tests for the favorites Redux slice.
 * 
 * TESTING TIP: Notice how each test is focused on ONE behavior.
 * This makes tests easier to:
 * - Understand when reading
 * - Debug when they fail
 * - Maintain over time
 */

import favoritesReducer, {
  toggleFavorite,
  addFavorite,
  removeFavorite,
  clearFavorites,
  loadFavorites,
  selectFavoriteIds,
  selectIsFavorite,
  selectFavoritesHydrated,
  selectFavoritesCount,
} from '../../store/slices/favoritesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';

// ============================================
// REDUCER TESTS
// ============================================

describe('favoritesSlice reducers', () => {
  const initialState = {
    ids: [] as string[],
    hydrated: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----------------------------------------
  // toggleFavorite Tests
  // ----------------------------------------
  describe('toggleFavorite', () => {
    /**
     * Toggle is an "on/off switch" - it adds if not present,
     * removes if already present. We test both directions.
     */
    it('should add product to favorites when not favorited', () => {
      const state = { ...initialState };
      
      const newState = favoritesReducer(state, toggleFavorite('product-1'));
      
      expect(newState.ids).toContain('product-1');
      expect(newState.ids).toHaveLength(1);
    });

    it('should remove product from favorites when already favorited', () => {
      const state = {
        ...initialState,
        ids: ['product-1', 'product-2'],
      };
      
      const newState = favoritesReducer(state, toggleFavorite('product-1'));
      
      expect(newState.ids).not.toContain('product-1');
      expect(newState.ids).toContain('product-2');
      expect(newState.ids).toHaveLength(1);
    });

    it('should work correctly when toggling multiple times', () => {
      let state = { ...initialState };
      
      // Add
      state = favoritesReducer(state, toggleFavorite('product-1'));
      expect(state.ids).toHaveLength(1);
      
      // Remove
      state = favoritesReducer(state, toggleFavorite('product-1'));
      expect(state.ids).toHaveLength(0);
      
      // Add again
      state = favoritesReducer(state, toggleFavorite('product-1'));
      expect(state.ids).toHaveLength(1);
    });
  });

  // ----------------------------------------
  // addFavorite Tests
  // ----------------------------------------
  describe('addFavorite', () => {
    it('should add a new product to favorites', () => {
      const state = { ...initialState };
      
      const newState = favoritesReducer(state, addFavorite('product-1'));
      
      expect(newState.ids).toContain('product-1');
    });

    /**
     * IDEMPOTENCY: Adding the same item twice should result in
     * only one entry. This prevents duplicate favorites.
     */
    it('should not add duplicate favorites', () => {
      const state = {
        ...initialState,
        ids: ['product-1'],
      };
      
      const newState = favoritesReducer(state, addFavorite('product-1'));
      
      expect(newState.ids).toHaveLength(1);
    });
  });

  // ----------------------------------------
  // removeFavorite Tests
  // ----------------------------------------
  describe('removeFavorite', () => {
    it('should remove product from favorites', () => {
      const state = {
        ...initialState,
        ids: ['product-1', 'product-2'],
      };
      
      const newState = favoritesReducer(state, removeFavorite('product-1'));
      
      expect(newState.ids).not.toContain('product-1');
      expect(newState.ids).toContain('product-2');
    });

    it('should handle removing non-existent favorite gracefully', () => {
      const state = {
        ...initialState,
        ids: ['product-1'],
      };
      
      const newState = favoritesReducer(state, removeFavorite('non-existent'));
      
      expect(newState.ids).toEqual(['product-1']);
    });
  });

  // ----------------------------------------
  // clearFavorites Tests
  // ----------------------------------------
  describe('clearFavorites', () => {
    it('should remove all favorites', () => {
      const state = {
        ...initialState,
        ids: ['product-1', 'product-2', 'product-3'],
      };
      
      const newState = favoritesReducer(state, clearFavorites());
      
      expect(newState.ids).toHaveLength(0);
    });
  });
});

// ============================================
// SELECTOR TESTS
// ============================================

describe('favoritesSlice selectors', () => {
  describe('selectFavoriteIds', () => {
    it('should return all favorite IDs', () => {
      const ids = ['product-1', 'product-2'];
      const state = { favorites: { ids, hydrated: true } };
      
      expect(selectFavoriteIds(state)).toEqual(ids);
    });
  });

  describe('selectIsFavorite', () => {
    it('should return true for favorited product', () => {
      const state = {
        favorites: { ids: ['product-1'], hydrated: true },
      };
      
      expect(selectIsFavorite(state, 'product-1')).toBe(true);
    });

    it('should return false for non-favorited product', () => {
      const state = {
        favorites: { ids: ['product-1'], hydrated: true },
      };
      
      expect(selectIsFavorite(state, 'product-2')).toBe(false);
    });
  });

  describe('selectFavoritesHydrated', () => {
    it('should return hydrated status', () => {
      const state = { favorites: { ids: [], hydrated: true } };
      expect(selectFavoritesHydrated(state)).toBe(true);
      
      const state2 = { favorites: { ids: [], hydrated: false } };
      expect(selectFavoritesHydrated(state2)).toBe(false);
    });
  });

  describe('selectFavoritesCount', () => {
    it('should return the number of favorites', () => {
      const state = {
        favorites: { ids: ['p1', 'p2', 'p3'], hydrated: true },
      };
      
      expect(selectFavoritesCount(state)).toBe(3);
    });

    it('should return 0 when no favorites', () => {
      const state = { favorites: { ids: [], hydrated: true } };
      
      expect(selectFavoritesCount(state)).toBe(0);
    });
  });
});

// ============================================
// ASYNC THUNK TESTS
// ============================================

describe('favoritesSlice async thunks', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { favorites: favoritesReducer },
    });
    jest.clearAllMocks();
  });

  describe('loadFavorites', () => {
    it('should load favorites from AsyncStorage', async () => {
      const savedFavorites = ['product-1', 'product-2'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(savedFavorites)
      );
      
      await store.dispatch(loadFavorites());
      
      const state = store.getState().favorites;
      expect(state.ids).toEqual(savedFavorites);
      expect(state.hydrated).toBe(true);
    });

    it('should return empty array when no saved favorites', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      await store.dispatch(loadFavorites());
      
      const state = store.getState().favorites;
      expect(state.ids).toEqual([]);
      expect(state.hydrated).toBe(true);
    });

    it('should set hydrated to true even on error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );
      
      await store.dispatch(loadFavorites());
      
      expect(store.getState().favorites.hydrated).toBe(true);
    });
  });
});

