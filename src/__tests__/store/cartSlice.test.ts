/**
 * ============================================
 * CART SLICE UNIT TESTS
 * ============================================
 * 
 * This file tests the Redux cart slice. When testing Redux slices, we test:
 * 
 * 1. REDUCERS: Functions that modify state based on actions
 * 2. SELECTORS: Functions that read data from state
 * 3. ASYNC THUNKS: Async operations that dispatch actions
 * 
 * KEY TESTING CONCEPTS:
 * 
 * - describe(): Groups related tests together
 * - it() / test(): Defines a single test case
 * - expect(): Makes assertions about values
 * - beforeEach(): Runs before each test (great for resetting state)
 * 
 * BEST PRACTICES:
 * 
 * - Test one thing per test case
 * - Use descriptive test names that explain what should happen
 * - Follow AAA pattern: Arrange, Act, Assert
 */

import cartReducer, {
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
} from '../../store/slices/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import type { CartItem } from '../../types';

// ============================================
// REDUCER TESTS
// ============================================

describe('cartSlice reducers', () => {
  // Define initial state for testing
  const initialState = {
    items: [] as CartItem[],
    hydrated: false,
  };

  /**
   * beforeEach() runs before every test in this describe block.
   * Here we clear AsyncStorage to ensure tests don't affect each other.
   * This is called "test isolation" - each test should be independent.
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----------------------------------------
  // addToCart Tests
  // ----------------------------------------
  describe('addToCart', () => {
    /**
     * Test adding a new item to an empty cart.
     * 
     * PATTERN: Arrange → Act → Assert
     * - Arrange: Set up initial state (empty cart)
     * - Act: Dispatch addToCart action
     * - Assert: Verify item was added with quantity 1
     */
    it('should add a new item to empty cart with quantity 1', () => {
      // Arrange: Start with empty cart
      const state = { ...initialState };
      
      // Act: Add product to cart
      const newState = cartReducer(state, addToCart('product-1'));
      
      // Assert: Check the cart has one item with correct data
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual({
        productId: 'product-1',
        quantity: 1,
      });
    });

    /**
     * Test adding the same item again increments quantity.
     * This tests the "upsert" behavior of the cart.
     */
    it('should increment quantity when adding existing item', () => {
      // Arrange: Cart already has one item
      const state = {
        ...initialState,
        items: [{ productId: 'product-1', quantity: 1 }],
      };
      
      // Act: Add same product again
      const newState = cartReducer(state, addToCart('product-1'));
      
      // Assert: Quantity should be 2, not a new item
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].quantity).toBe(2);
    });

    it('should add different products as separate items', () => {
      // Arrange
      const state = {
        ...initialState,
        items: [{ productId: 'product-1', quantity: 1 }],
      };
      
      // Act
      const newState = cartReducer(state, addToCart('product-2'));
      
      // Assert
      expect(newState.items).toHaveLength(2);
      expect(newState.items[1].productId).toBe('product-2');
    });
  });

  // ----------------------------------------
  // removeFromCart Tests
  // ----------------------------------------
  describe('removeFromCart', () => {
    it('should remove an item from cart', () => {
      // Arrange
      const state = {
        ...initialState,
        items: [
          { productId: 'product-1', quantity: 2 },
          { productId: 'product-2', quantity: 1 },
        ],
      };
      
      // Act
      const newState = cartReducer(state, removeFromCart('product-1'));
      
      // Assert
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].productId).toBe('product-2');
    });

    it('should handle removing non-existent item gracefully', () => {
      // Arrange
      const state = {
        ...initialState,
        items: [{ productId: 'product-1', quantity: 1 }],
      };
      
      // Act
      const newState = cartReducer(state, removeFromCart('non-existent'));
      
      // Assert: Cart should remain unchanged
      expect(newState.items).toHaveLength(1);
    });
  });

  // ----------------------------------------
  // updateQuantity Tests
  // ----------------------------------------
  describe('updateQuantity', () => {
    it('should update quantity of an existing item', () => {
      const state = {
        ...initialState,
        items: [{ productId: 'product-1', quantity: 1 }],
      };
      
      const newState = cartReducer(
        state,
        updateQuantity({ productId: 'product-1', quantity: 5 })
      );
      
      expect(newState.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is set to 0', () => {
      const state = {
        ...initialState,
        items: [{ productId: 'product-1', quantity: 3 }],
      };
      
      const newState = cartReducer(
        state,
        updateQuantity({ productId: 'product-1', quantity: 0 })
      );
      
      expect(newState.items).toHaveLength(0);
    });

    it('should remove item when quantity is negative', () => {
      const state = {
        ...initialState,
        items: [{ productId: 'product-1', quantity: 3 }],
      };
      
      const newState = cartReducer(
        state,
        updateQuantity({ productId: 'product-1', quantity: -1 })
      );
      
      expect(newState.items).toHaveLength(0);
    });
  });

  // ----------------------------------------
  // incrementQuantity / decrementQuantity Tests
  // ----------------------------------------
  describe('incrementQuantity', () => {
    it('should increment quantity by 1', () => {
      const state = {
        ...initialState,
        items: [{ productId: 'product-1', quantity: 3 }],
      };
      
      const newState = cartReducer(state, incrementQuantity('product-1'));
      
      expect(newState.items[0].quantity).toBe(4);
    });

    it('should do nothing if item not in cart', () => {
      const state = {
        ...initialState,
        items: [{ productId: 'product-1', quantity: 3 }],
      };
      
      const newState = cartReducer(state, incrementQuantity('non-existent'));
      
      expect(newState.items).toEqual(state.items);
    });
  });

  describe('decrementQuantity', () => {
    it('should decrement quantity by 1', () => {
      const state = {
        ...initialState,
        items: [{ productId: 'product-1', quantity: 3 }],
      };
      
      const newState = cartReducer(state, decrementQuantity('product-1'));
      
      expect(newState.items[0].quantity).toBe(2);
    });

    it('should remove item when quantity reaches 0', () => {
      const state = {
        ...initialState,
        items: [{ productId: 'product-1', quantity: 1 }],
      };
      
      const newState = cartReducer(state, decrementQuantity('product-1'));
      
      expect(newState.items).toHaveLength(0);
    });
  });

  // ----------------------------------------
  // clearCart Tests
  // ----------------------------------------
  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const state = {
        ...initialState,
        items: [
          { productId: 'product-1', quantity: 2 },
          { productId: 'product-2', quantity: 3 },
        ],
      };
      
      const newState = cartReducer(state, clearCart());
      
      expect(newState.items).toHaveLength(0);
    });
  });
});

// ============================================
// SELECTOR TESTS
// ============================================

describe('cartSlice selectors', () => {
  /**
   * Selectors are pure functions that extract data from state.
   * We test them by passing different state shapes and checking outputs.
   */

  describe('selectCartItems', () => {
    it('should return all cart items', () => {
      const items = [
        { productId: 'product-1', quantity: 1 },
        { productId: 'product-2', quantity: 2 },
      ];
      
      const state = { cart: { items, hydrated: true } };
      
      expect(selectCartItems(state)).toEqual(items);
    });

    it('should return empty array when cart is empty', () => {
      const state = { cart: { items: [], hydrated: true } };
      
      expect(selectCartItems(state)).toEqual([]);
    });
  });

  describe('selectCartItemCount', () => {
    it('should return total quantity of all items', () => {
      const state = {
        cart: {
          items: [
            { productId: 'product-1', quantity: 2 },
            { productId: 'product-2', quantity: 3 },
          ],
          hydrated: true,
        },
      };
      
      // Total: 2 + 3 = 5
      expect(selectCartItemCount(state)).toBe(5);
    });

    it('should return 0 for empty cart', () => {
      const state = { cart: { items: [], hydrated: true } };
      
      expect(selectCartItemCount(state)).toBe(0);
    });
  });

  describe('selectCartItemById', () => {
    it('should return cart item for given productId', () => {
      const state = {
        cart: {
          items: [
            { productId: 'product-1', quantity: 2 },
            { productId: 'product-2', quantity: 3 },
          ],
          hydrated: true,
        },
      };
      
      expect(selectCartItemById(state, 'product-1')).toEqual({
        productId: 'product-1',
        quantity: 2,
      });
    });

    it('should return undefined if item not in cart', () => {
      const state = { cart: { items: [], hydrated: true } };
      
      expect(selectCartItemById(state, 'non-existent')).toBeUndefined();
    });
  });

  describe('selectIsInCart', () => {
    it('should return true if product is in cart', () => {
      const state = {
        cart: {
          items: [{ productId: 'product-1', quantity: 1 }],
          hydrated: true,
        },
      };
      
      expect(selectIsInCart(state, 'product-1')).toBe(true);
    });

    it('should return false if product is not in cart', () => {
      const state = { cart: { items: [], hydrated: true } };
      
      expect(selectIsInCart(state, 'product-1')).toBe(false);
    });
  });

  describe('selectCartHydrated', () => {
    it('should return hydrated status', () => {
      expect(selectCartHydrated({ cart: { items: [], hydrated: true } })).toBe(true);
      expect(selectCartHydrated({ cart: { items: [], hydrated: false } })).toBe(false);
    });
  });
});

// ============================================
// ASYNC THUNK TESTS
// ============================================

describe('cartSlice async thunks', () => {
  /**
   * Testing async thunks requires a real Redux store.
   * We use configureStore from @reduxjs/toolkit to create a test store.
   * 
   * For async operations, we mock external dependencies (like AsyncStorage)
   * to control their behavior and avoid real I/O operations.
   */

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: { cart: cartReducer },
    });
    
    // Clear all mocks between tests
    jest.clearAllMocks();
  });

  describe('loadCart', () => {
    it('should load cart items from AsyncStorage', async () => {
      // Arrange: Mock AsyncStorage to return saved cart
      const savedCart = [{ productId: 'product-1', quantity: 2 }];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(savedCart)
      );
      
      // Act: Dispatch the loadCart thunk
      await store.dispatch(loadCart());
      
      // Assert: Check state was updated
      const state = store.getState().cart;
      expect(state.items).toEqual(savedCart);
      expect(state.hydrated).toBe(true);
    });

    it('should return empty array when no saved cart exists', async () => {
      // Arrange: AsyncStorage returns null (no saved data)
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      // Act
      await store.dispatch(loadCart());
      
      // Assert
      const state = store.getState().cart;
      expect(state.items).toEqual([]);
      expect(state.hydrated).toBe(true);
    });

    it('should set hydrated to true even when load fails', async () => {
      // Arrange: AsyncStorage throws an error
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );
      
      // Act
      await store.dispatch(loadCart());
      
      // Assert: hydrated should still be true (app can continue)
      const state = store.getState().cart;
      expect(state.hydrated).toBe(true);
    });
  });

  describe('saveCart', () => {
    it('should save cart items to AsyncStorage', async () => {
      // Arrange
      const cartItems = [{ productId: 'product-1', quantity: 2 }];
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      
      // Act
      await store.dispatch(saveCart(cartItems));
      
      // Assert: Verify AsyncStorage was called correctly
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        expect.any(String), // The storage key
        JSON.stringify(cartItems)
      );
    });
  });
});

