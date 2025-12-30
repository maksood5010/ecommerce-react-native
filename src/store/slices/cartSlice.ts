import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants';
import type { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  hydrated: boolean;
}

const initialState: CartState = {
  items: [],
  hydrated: false,
};

export const loadCart = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>('cart/loadCart', async (_, { rejectWithValue }) => {
  try {
    const storedCart = await AsyncStorage.getItem(STORAGE_KEYS.CART);
    if (storedCart) {
      return JSON.parse(storedCart) as CartItem[];
    }
    return [];
  } catch (error) {
    console.error('Failed to load cart:', error);
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to load cart'
    );
  }
});

export const saveCart = createAsyncThunk<
  void,
  CartItem[],
  { rejectValue: string }
>('cart/saveCart', async (cartItems, { rejectWithValue }) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Failed to save cart:', error);
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to save cart'
    );
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const existingItem = state.items.find((item) => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ productId, quantity: 1 });
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== productId);
        } else {
          item.quantity = quantity;
        }
      }
    },

    incrementQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity += 1;
      }
    },

    decrementQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter((i) => i.productId !== productId);
        } else {
          item.quantity -= 1;
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
        state.hydrated = true;
      })
      .addCase(loadCart.rejected, (state) => {
        state.hydrated = true;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartItemById = (state: { cart: CartState }, productId: string) =>
  state.cart.items.find((item) => item.productId === productId);

export const selectIsInCart = (state: { cart: CartState }, productId: string) =>
  state.cart.items.some((item) => item.productId === productId);

export const selectCartHydrated = (state: { cart: CartState }) => state.cart.hydrated;

export default cartSlice.reducer;

