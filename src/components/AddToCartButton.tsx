import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants';

interface AddToCartButtonProps {
  isInCart: boolean;
  quantity?: number;
  onAdd: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  compact?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  isInCart,
  quantity = 0,
  onAdd,
  onIncrement,
  onDecrement,
  compact = false,
}) => {
  if (isInCart && onIncrement && onDecrement) {
    return (
      <View style={[styles.quantityContainer, compact && styles.quantityContainerCompact]}>
        <Pressable
          style={({ pressed }) => [styles.quantityButton, pressed && styles.pressed]}
          onPress={onDecrement}
          accessibilityRole="button"
          accessibilityLabel="Decrease quantity"
        >
          <Ionicons name="remove" size={compact ? 16 : 20} color={COLORS.primary} />
        </Pressable>

        <Text style={[styles.quantityText, compact && styles.quantityTextCompact]}>
          {quantity}
        </Text>

        <Pressable
          style={({ pressed }) => [styles.quantityButton, pressed && styles.pressed]}
          onPress={onIncrement}
          accessibilityRole="button"
          accessibilityLabel="Increase quantity"
        >
          <Ionicons name="add" size={compact ? 16 : 20} color={COLORS.primary} />
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.addButton,
        compact && styles.addButtonCompact,
        pressed && styles.pressed,
      ]}
      onPress={onAdd}
      accessibilityRole="button"
      accessibilityLabel="Add to cart"
    >
      <Ionicons name="cart-outline" size={compact ? 16 : 20} color={COLORS.textInverse} />
      {!compact && <Text style={styles.addButtonText}>Add to Cart</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  addButtonCompact: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  addButtonText: {
    color: COLORS.textInverse,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  quantityContainerCompact: {
    borderRadius: BORDER_RADIUS.full,
  },
  quantityButton: {
    padding: SPACING.sm,
  },
  quantityText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minWidth: 32,
    textAlign: 'center',
  },
  quantityTextCompact: {
    fontSize: FONT_SIZES.sm,
    minWidth: 24,
  },
  pressed: {
    opacity: 0.7,
  },
});

