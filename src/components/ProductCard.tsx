import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import type { Product } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, SHADOWS, BREAKPOINTS } from '../constants';
import { FavoriteButton } from './FavoriteButton';
import { AddToCartButton } from './AddToCartButton';
import { Price } from './Price';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  showFavoriteButton?: boolean;
  isInCart?: boolean;
  cartQuantity?: number;
  onAddToCart?: () => void;
  onIncrementCart?: () => void;
  onDecrementCart?: () => void;
  showCartButton?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  showFavoriteButton = true,
  isInCart = false,
  cartQuantity = 0,
  onAddToCart,
  onIncrementCart,
  onDecrementCart,
  showCartButton = true,
}) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= BREAKPOINTS.tablet;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isTablet && styles.containerTablet,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${product.price.toFixed(2)} Dirhams`}
      accessibilityHint="Double tap to view product details"
    >
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="cover"
        accessibilityLabel={`Image of ${product.name}`}
      />
      
      {showFavoriteButton && onToggleFavorite && (
        <View style={styles.favoriteContainer}>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            productName={product.name}
          />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Price amount={product.price} size="lg" />
          {showCartButton && onAddToCart && (
            <AddToCartButton
              isInCart={isInCart}
              quantity={cartQuantity}
              onAdd={onAddToCart}
              onIncrement={onIncrementCart}
              onDecrement={onDecrementCart}
              compact
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  containerTablet: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.background,
  },
  favoriteContainer: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
  content: {
    padding: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
