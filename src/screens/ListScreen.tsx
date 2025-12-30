import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductsStackParamList } from '../types';
import {
  useAppDispatch,
  useAppSelector,
  fetchProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectFavoriteIds,
  toggleFavorite,
  selectCartItems,
  addToCart,
  incrementQuantity,
  decrementQuantity,
} from '../store';
import { searchProducts } from '../services';
import {
  ProductGrid,
  SearchBar,
  LoadingState,
  ErrorState,
} from '../components';
import { COLORS } from '../constants';

type NavigationProp = NativeStackNavigationProp<ProductsStackParamList, 'List'>;

export const ListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const cartItems = useAppSelector(selectCartItems);

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchProducts());
    setRefreshing(false);
  }, [dispatch]);

  const handleProductPress = useCallback(
    (productId: string) => {
      navigation.navigate('Details', { productId });
    },
    [navigation]
  );

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      dispatch(toggleFavorite(productId));
    },
    [dispatch]
  );

  const handleAddToCart = useCallback(
    (productId: string) => {
      dispatch(addToCart(productId));
    },
    [dispatch]
  );

  const handleIncrementCart = useCallback(
    (productId: string) => {
      dispatch(incrementQuantity(productId));
    },
    [dispatch]
  );

  const handleDecrementCart = useCallback(
    (productId: string) => {
      dispatch(decrementQuantity(productId));
    },
    [dispatch]
  );

  const handleRetry = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = searchProducts(products, searchQuery);

  if (loading && products.length === 0) {
    return <LoadingState message="Loading products..." />;
  }

  if (error && products.length === 0) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  return (
    <View style={styles.container}>
      <ProductGrid
        products={filteredProducts}
        favoriteIds={favoriteIds}
        cartItems={cartItems}
        onProductPress={handleProductPress}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        onIncrementCart={handleIncrementCart}
        onDecrementCart={handleDecrementCart}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        emptyMessage={
          searchQuery
            ? `No products found for "${searchQuery}"`
            : 'No products available'
        }
        ListHeaderComponent={
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
