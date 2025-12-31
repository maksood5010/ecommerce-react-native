/**
 * ============================================
 * TEST UTILITIES
 * ============================================
 * 
 * This file contains helpers for testing components
 * that require Redux Provider or other context.
 * 
 * CONCEPT: CUSTOM RENDER FUNCTION
 * 
 * React Native Testing Library's render() doesn't include
 * Redux Provider. For components that use Redux hooks,
 * we create a custom render that wraps components with
 * the necessary providers.
 */

import React, { ReactElement, PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from '../../store/slices/cartSlice';
import favoritesReducer from '../../store/slices/favoritesSlice';
import productsReducer from '../../store/slices/productsSlice';

// Create the root reducer
const rootReducer = combineReducers({
  cart: cartReducer,
  favorites: favoritesReducer,
  products: productsReducer,
});

// Infer the RootState type
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;

/**
 * Creates a Redux store for testing.
 * Optionally accepts preloaded state to set up specific test scenarios.
 */
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

// Props for the custom render function
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

/**
 * Custom render function that wraps components with Redux Provider.
 * 
 * USAGE:
 * 
 * ```tsx
 * // Basic usage
 * const { getByText } = renderWithProviders(<MyComponent />);
 * 
 * // With preloaded state
 * const { getByText } = renderWithProviders(<MyComponent />, {
 *   preloadedState: {
 *     cart: { items: [{ productId: '1', quantity: 2 }], hydrated: true },
 *   },
 * });
 * 
 * // With custom store
 * const store = setupStore();
 * const { getByText } = renderWithProviders(<MyComponent />, { store });
 * // Now you can dispatch actions to `store` during the test
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  // Wrapper component that provides Redux store
  function Wrapper({ children }: PropsWithChildren<object>): React.JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return the render result along with the store for inspection
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * ============================================
 * MOCK DATA FACTORIES
 * ============================================
 * 
 * Factory functions create consistent test data.
 * Using factories instead of hardcoded objects:
 * 
 * 1. Reduces duplication
 * 2. Makes tests more readable
 * 3. Allows easy customization via overrides
 */

import type { Product } from '../../types';
import type { CartItem } from '../../types';

/**
 * Create a mock Product with sensible defaults.
 * Override any field by passing it in the overrides object.
 */
export const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: `product-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Product',
  price: 99.99,
  image: 'https://picsum.photos/400',
  description: 'This is a test product description.',
  ...overrides,
});

/**
 * Create a mock CartItem.
 */
export const createMockCartItem = (
  overrides: Partial<CartItem> = {}
): CartItem => ({
  productId: `product-${Math.random().toString(36).substr(2, 9)}`,
  quantity: 1,
  ...overrides,
});

/**
 * Create multiple mock products at once.
 */
export const createMockProducts = (count: number): Product[] =>
  Array.from({ length: count }, (_, index) =>
    createMockProduct({
      id: `product-${index + 1}`,
      name: `Product ${index + 1}`,
      price: 10 + index * 10,
    })
  );

/**
 * ============================================
 * COMMON TEST SCENARIOS
 * ============================================
 * 
 * Pre-configured states for common testing scenarios.
 */

export const emptyState: Partial<RootState> = {
  cart: { items: [], hydrated: true },
  favorites: { ids: [], hydrated: true },
  products: { items: [], loading: false, error: null },
};

export const loadedState: Partial<RootState> = {
  cart: { items: [], hydrated: true },
  favorites: { ids: [], hydrated: true },
  products: {
    items: createMockProducts(5),
    loading: false,
    error: null,
  },
};

export const cartWithItemsState: Partial<RootState> = {
  cart: {
    items: [
      { productId: 'product-1', quantity: 2 },
      { productId: 'product-2', quantity: 1 },
    ],
    hydrated: true,
  },
  favorites: { ids: [], hydrated: true },
  products: {
    items: createMockProducts(5),
    loading: false,
    error: null,
  },
};

/**
 * Re-export everything from testing library for convenience.
 * This way, tests only need to import from this file.
 */
export * from '@testing-library/react-native';

