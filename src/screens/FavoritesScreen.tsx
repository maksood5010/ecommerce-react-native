import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FavoritesStackParamList } from '../types';
import {
  useAppDispatch,
  useAppSelector,
  selectProducts,
  selectFavoriteIds,
  toggleFavorite,
} from '../store';
import { ProductGrid, EmptyState } from '../components';
import { COLORS } from '../constants';

type NavigationProp = NativeStackNavigationProp<FavoritesStackParamList, 'Favorites'>;

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectProducts);
  const favoriteIds = useAppSelector(selectFavoriteIds);

  const favoriteProducts = useMemo(
    () => products.filter((product) => favoriteIds.includes(product.id)),
    [products, favoriteIds]
  );

  const handleProductPress = useCallback(
    (productId: string) => {
      navigation.navigate('FavoriteDetails', { productId });
    },
    [navigation]
  );

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      dispatch(toggleFavorite(productId));
    },
    [dispatch]
  );

  if (favoriteProducts.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          message="No favorites yet. Start adding products you love!"
          icon="heart-outline"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProductGrid
        products={favoriteProducts}
        favoriteIds={favoriteIds}
        onProductPress={handleProductPress}
        onToggleFavorite={handleToggleFavorite}
        emptyMessage="No favorites yet"
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

