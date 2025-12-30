import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Product } from '../types';
import { Price } from './Price';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  SHADOWS,
} from '../constants';

interface CartItemCardProps {
  product: Product;
  quantity: number;
  onPress: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  product,
  quantity,
  onPress,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const itemTotal = product.price * quantity;

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, quantity ${quantity}, total ${itemTotal.toFixed(2)} Dirhams`}
    >
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Price amount={product.price} size="sm" color={COLORS.textSecondary} />

        <View style={styles.actions}>
          <View style={styles.quantityContainer}>
            <Pressable
              style={({ pressed }) => [styles.quantityButton, pressed && styles.buttonPressed]}
              onPress={onDecrement}
              accessibilityLabel="Decrease quantity"
            >
              <Ionicons name="remove" size={18} color={COLORS.primary} />
            </Pressable>

            <Text style={styles.quantityText}>{quantity}</Text>

            <Pressable
              style={({ pressed }) => [styles.quantityButton, pressed && styles.buttonPressed]}
              onPress={onIncrement}
              accessibilityLabel="Increase quantity"
            >
              <Ionicons name="add" size={18} color={COLORS.primary} />
            </Pressable>
          </View>

          <Price amount={itemTotal} size="md" />
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.removeButton, pressed && styles.buttonPressed]}
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel="Remove from cart"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.error} />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  pressed: {
    opacity: 0.95,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
  },
  quantityButton: {
    padding: SPACING.xs,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  quantityText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minWidth: 28,
    textAlign: 'center',
  },
  removeButton: {
    padding: SPACING.xs,
    alignSelf: 'flex-start',
  },
});
