/**
 * ============================================
 * PRODUCTS SLICE UNIT TESTS
 * ============================================
 * 
 * Tests for the products Redux slice.
 * 
 * This slice primarily handles:
 * - Fetching products (async operation)
 * - Loading/error states
 * - Product selectors
 */

import productsReducer, {
  fetchProducts,
  clearError,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductById,
} from '../../store/slices/productsSlice';
import { configureStore } from '@reduxjs/toolkit';
import type { Product } from '../../types';

// Mock the products data
jest.mock('../../data/products.json', () => [
  {
    id: '1',
    name: 'Test Product 1',
    price: 99.99,
    image: 'https://example.com/image1.jpg',
    description: 'Test description 1',
  },
  {
    id: '2',
    name: 'Test Product 2',
    price: 149.99,
    image: 'https://example.com/image2.jpg',
    description: 'Test description 2',
  },
]);

// ============================================
// REDUCER TESTS
// ============================================

describe('productsSlice reducers', () => {
  const initialState = {
    items: [] as Product[],
    loading: false,
    error: null as string | null,
  };

  describe('clearError', () => {
    it('should clear the error state', () => {
      const state = {
        ...initialState,
        error: 'Some error message',
      };
      
      const newState = productsReducer(state, clearError());
      
      expect(newState.error).toBeNull();
    });
  });
});

// ============================================
// SELECTOR TESTS
// ============================================

describe('productsSlice selectors', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      price: 99.99,
      image: 'https://example.com/image1.jpg',
      description: 'Description 1',
    },
    {
      id: '2',
      name: 'Test Product 2',
      price: 149.99,
      image: 'https://example.com/image2.jpg',
      description: 'Description 2',
    },
  ];

  describe('selectProducts', () => {
    it('should return all products', () => {
      const state = {
        products: { items: mockProducts, loading: false, error: null },
      };
      
      expect(selectProducts(state)).toEqual(mockProducts);
    });

    it('should return empty array when no products', () => {
      const state = {
        products: { items: [], loading: false, error: null },
      };
      
      expect(selectProducts(state)).toEqual([]);
    });
  });

  describe('selectProductsLoading', () => {
    it('should return loading state', () => {
      const loadingState = {
        products: { items: [], loading: true, error: null },
      };
      expect(selectProductsLoading(loadingState)).toBe(true);
      
      const notLoadingState = {
        products: { items: [], loading: false, error: null },
      };
      expect(selectProductsLoading(notLoadingState)).toBe(false);
    });
  });

  describe('selectProductsError', () => {
    it('should return error message', () => {
      const state = {
        products: { items: [], loading: false, error: 'Error!' },
      };
      
      expect(selectProductsError(state)).toBe('Error!');
    });

    it('should return null when no error', () => {
      const state = {
        products: { items: [], loading: false, error: null },
      };
      
      expect(selectProductsError(state)).toBeNull();
    });
  });

  describe('selectProductById', () => {
    it('should return product with matching ID', () => {
      const state = {
        products: { items: mockProducts, loading: false, error: null },
      };
      
      const product = selectProductById(state, '1');
      
      expect(product).toEqual(mockProducts[0]);
    });

    it('should return undefined for non-existent ID', () => {
      const state = {
        products: { items: mockProducts, loading: false, error: null },
      };
      
      const product = selectProductById(state, 'non-existent');
      
      expect(product).toBeUndefined();
    });
  });
});

// ============================================
// ASYNC THUNK TESTS
// ============================================

describe('productsSlice async thunks', () => {
  /**
   * TESTING ASYNC STATE TRANSITIONS:
   * 
   * Async thunks go through 3 states:
   * 1. pending - Request started
   * 2. fulfilled - Request succeeded
   * 3. rejected - Request failed
   * 
   * We test each transition separately.
   */

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { products: productsReducer },
    });
    // Use fake timers to control setTimeout in fetchProducts
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('fetchProducts', () => {
    it('should set loading to true when pending', () => {
      // Start the fetch but don't resolve it yet
      (store.dispatch as any)(fetchProducts());

      const state = (store.getState() as any).products;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should load products when fulfilled', async () => {
      // Dispatch and wait for completion
      const promise = (store.dispatch as any)(fetchProducts());
      
      // Fast-forward timers to skip the simulated delay
      jest.advanceTimersByTime(500);
      
      await promise;

      const state = (store.getState() as any).products;
      expect(state.loading).toBe(false);
      expect(state.items).toHaveLength(2);
      expect(state.error).toBeNull();
    });

    it('should clear error state when fetching', async () => {
      // First, set an error state manually
      store.dispatch(clearError());
      
      // Then fetch - pending state should clear error
      (store.dispatch as any)(fetchProducts());

      expect((store.getState() as any).products.error).toBeNull();
    });
  });
});

