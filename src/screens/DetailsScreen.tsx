import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { ProductsStackParamList, FavoritesStackParamList, CartStackParamList } from '../types';
import {
  useAppDispatch,
  useAppSelector,
  selectProducts,
  selectFavoriteIds,
  toggleFavorite,
  selectCartItemById,
  addToCart,
  incrementQuantity,
  decrementQuantity,
} from '../store';
import { FavoriteButton, AddToCartButton, LoadingState, Price } from '../components';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  SHADOWS,
  BREAKPOINTS,
} from '../constants';

type DetailsRouteProp =
  | RouteProp<ProductsStackParamList, 'Details'>
  | RouteProp<FavoritesStackParamList, 'FavoriteDetails'>
  | RouteProp<CartStackParamList, 'CartProductDetails'>;

export const DetailsScreen: React.FC = () => {
  const route = useRoute<DetailsRouteProp>();
  const { productId } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width >= BREAKPOINTS.tablet;

  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const cartItem = useAppSelector((state) => selectCartItemById(state, productId));

  const product = products.find((p) => p.id === productId);
  const isFavorite = favoriteIds.includes(productId);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity ?? 0;

  const handleToggleFavorite = useCallback(() => {
    dispatch(toggleFavorite(productId));
  }, [dispatch, productId]);

  const handleAddToCart = useCallback(() => {
    dispatch(addToCart(productId));
  }, [dispatch, productId]);

  const handleIncrementCart = useCallback(() => {
    dispatch(incrementQuantity(productId));
  }, [dispatch, productId]);

  const handleDecrementCart = useCallback(() => {
    dispatch(decrementQuantity(productId));
  }, [dispatch, productId]);

  if (!product) {
    return <LoadingState message="Loading product..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        isTablet && styles.contentTablet,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.imageContainer, isTablet && styles.imageContainerTablet]}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={`Image of ${product.name}`}
        />
        <View style={styles.favoriteButtonContainer}>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={handleToggleFavorite}
            productName={product.name}
            size={28}
          />
        </View>
      </View>

      <View style={[styles.details, isTablet && styles.detailsTablet]}>
        <Text style={styles.name}>{product.name}</Text>
        
        <View style={styles.cartSection}>
          <Price amount={product.price} size="xl" />
          <AddToCartButton
            isInCart={isInCart}
            quantity={cartQuantity}
            onAdd={handleAddToCart}
            onIncrement={handleIncrementCart}
            onDecrement={handleDecrementCart}
          />
        </View>

        <View style={styles.divider} />
        
        <Text style={styles.descriptionLabel}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  contentTablet: {
    flexDirection: 'row',
    padding: SPACING.xl,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: COLORS.surface,
  },
  imageContainerTablet: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginRight: SPACING.xl,
    ...SHADOWS.card,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.background,
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
  },
  details: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    marginTop: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.card,
  },
  detailsTablet: {
    flex: 1,
    marginTop: 0,
    marginHorizontal: 0,
  },
  name: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  cartSection: {
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.lg,
  },
  descriptionLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
});
