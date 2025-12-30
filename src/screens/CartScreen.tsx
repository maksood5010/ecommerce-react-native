import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CartStackParamList } from '../types';
import {
  useAppDispatch,
  useAppSelector,
  selectProducts,
  selectCartItems,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from '../store';
import { CartItemCard, EmptyState, Price } from '../components';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  SHADOWS,
} from '../constants';

type NavigationProp = NativeStackNavigationProp<CartStackParamList, 'Cart'>;

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectProducts);
  const cartItems = useAppSelector(selectCartItems);

  const cartProducts = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? { product, quantity: item.quantity } : null;
      })
      .filter((item): item is { product: typeof products[0]; quantity: number } => item !== null);
  }, [cartItems, products]);

  const totalAmount = useMemo(() => {
    return cartProducts.reduce(
      (total, { product, quantity }) => total + product.price * quantity,
      0
    );
  }, [cartProducts]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const handleProductPress = useCallback(
    (productId: string) => {
      navigation.navigate('CartProductDetails', { productId });
    },
    [navigation]
  );

  const handleIncrement = useCallback(
    (productId: string) => {
      dispatch(incrementQuantity(productId));
    },
    [dispatch]
  );

  const handleDecrement = useCallback(
    (productId: string) => {
      dispatch(decrementQuantity(productId));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (productId: string) => {
      dispatch(removeFromCart(productId));
    },
    [dispatch]
  );

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  if (cartProducts.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          message="Your cart is empty. Start shopping!"
          icon="cart-outline"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartProducts}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => (
          <CartItemCard
            product={item.product}
            quantity={item.quantity}
            onPress={() => handleProductPress(item.product.id)}
            onIncrement={() => handleIncrement(item.product.id)}
            onDecrement={() => handleDecrement(item.product.id)}
            onRemove={() => handleRemove(item.product.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerText}>{totalItems} items in cart</Text>
            <Pressable
              onPress={handleClearCart}
              accessibilityRole="button"
              accessibilityLabel="Clear cart"
            >
              <Text style={styles.clearText}>Clear All</Text>
            </Pressable>
          </View>
        }
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Price amount={totalAmount} size="xl" color={COLORS.textPrimary} />
        </View>

        <Pressable
          style={({ pressed }) => [styles.checkoutButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`Checkout, total ${totalAmount.toFixed(2)} Dirhams`}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  clearText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.error,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    ...SHADOWS.elevated,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  totalLabel: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  checkoutText: {
    color: COLORS.textInverse,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
});
