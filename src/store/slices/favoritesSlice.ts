import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants';

interface FavoritesState {
  ids: string[];
  hydrated: boolean;
}

const initialState: FavoritesState = {
  ids: [],
  hydrated: false,
};

export const loadFavorites = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>('favorites/loadFavorites', async (_, { rejectWithValue }) => {
  try {
    const storedFavorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (storedFavorites) {
      return JSON.parse(storedFavorites) as string[];
    }
    return [];
  } catch (error) {
    console.error('Failed to load favorites:', error);
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to load favorites'
    );
  }
});

export const saveFavorites = createAsyncThunk<
  void,
  string[],
  { rejectValue: string }
>('favorites/saveFavorites', async (favoriteIds, { rejectWithValue }) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(favoriteIds)
    );
  } catch (error) {
    console.error('Failed to save favorites:', error);
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to save favorites'
    );
  }
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const index = state.ids.indexOf(productId);

      if (index === -1) {
        state.ids.push(productId);
      } else {
        state.ids.splice(index, 1);
      }
    },

    addFavorite: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      if (!state.ids.includes(productId)) {
        state.ids.push(productId);
      }
    },

    removeFavorite: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const index = state.ids.indexOf(productId);
      if (index !== -1) {
        state.ids.splice(index, 1);
      }
    },

    clearFavorites: (state) => {
      state.ids = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        loadFavorites.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.ids = action.payload;
          state.hydrated = true;
        }
      )
      .addCase(loadFavorites.rejected, (state) => {
        state.hydrated = true;
      });
  },
});

export const { toggleFavorite, addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;

export const selectFavoriteIds = (state: { favorites: FavoritesState }) =>
  state.favorites.ids;

export const selectIsFavorite = (
  state: { favorites: FavoritesState },
  productId: string
) => state.favorites.ids.includes(productId);

export const selectFavoritesHydrated = (state: { favorites: FavoritesState }) =>
  state.favorites.hydrated;

export const selectFavoritesCount = (state: { favorites: FavoritesState }) =>
  state.favorites.ids.length;

export default favoritesSlice.reducer;
