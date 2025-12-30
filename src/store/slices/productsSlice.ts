import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types';
import productsData from '../../data/products.json';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return productsData as Product[];
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch products'
    );
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.items = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'An unknown error occurred';
      });
  },
});

export const { clearError } = productsSlice.actions;

export const selectProducts = (state: { products: ProductsState }) =>
  state.products.items;

export const selectProductsLoading = (state: { products: ProductsState }) =>
  state.products.loading;

export const selectProductsError = (state: { products: ProductsState }) =>
  state.products.error;

export const selectProductById = (
  state: { products: ProductsState },
  productId: string
) => state.products.items.find((product) => product.id === productId);

export default productsSlice.reducer;
