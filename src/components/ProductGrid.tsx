import React, { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import type { Product, CartItem } from '../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from './EmptyState';
import { SPACING, BREAKPOINTS, GRID } from '../constants';

interface ProductGridProps {
  products: Product[];
  favoriteIds: string[];
  cartItems?: CartItem[];
  onProductPress: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onIncrementCart?: (productId: string) => void;
  onDecrementCart?: (productId: string) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
  showFavoriteButtons?: boolean;
  showCartButtons?: boolean;
  ListHeaderComponent?: React.ReactElement;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  favoriteIds,
  cartItems = [],
  onProductPress,
  onToggleFavorite,
  onAddToCart,
  onIncrementCart,
  onDecrementCart,
  refreshing = false,
  onRefresh,
  emptyMessage = 'No products found',
  showFavoriteButtons = true,
  showCartButtons = true,
  ListHeaderComponent,
}) => {
  const { width } = useWindowDimensions();
  const numColumns = width >= BREAKPOINTS.tablet ? GRID.tabletColumns : GRID.mobileColumns;

  const getCartItem = useCallback(
    (productId: string) => cartItems.find((item) => item.productId === productId),
    [cartItems]
  );

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => {
      const cartItem = getCartItem(item.id);
      return (
        <ProductCard
          product={item}
          onPress={() => onProductPress(item.id)}
          isFavorite={favoriteIds.includes(item.id)}
          onToggleFavorite={() => onToggleFavorite(item.id)}
          showFavoriteButton={showFavoriteButtons}
          isInCart={!!cartItem}
          cartQuantity={cartItem?.quantity ?? 0}
          onAddToCart={onAddToCart ? () => onAddToCart(item.id) : undefined}
          onIncrementCart={onIncrementCart ? () => onIncrementCart(item.id) : undefined}
          onDecrementCart={onDecrementCart ? () => onDecrementCart(item.id) : undefined}
          showCartButton={showCartButtons && !!onAddToCart}
        />
      );
    },
    [
      favoriteIds,
      onProductPress,
      onToggleFavorite,
      showFavoriteButtons,
      getCartItem,
      onAddToCart,
      onIncrementCart,
      onDecrementCart,
      showCartButtons,
    ]
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  if (products.length === 0) {
    return (
      <>
        {ListHeaderComponent}
        <EmptyState message={emptyMessage} />
      </>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      key={numColumns}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
