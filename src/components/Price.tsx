import React from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { DirhamIcon } from './DirhamIcon';
import { COLORS, FONT_SIZES, SPACING } from '../constants';

interface PriceProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  style?: ViewStyle;
}

const sizeConfig = {
  sm: { fontSize: FONT_SIZES.sm, iconSize: 12 },
  md: { fontSize: FONT_SIZES.md, iconSize: 14 },
  lg: { fontSize: FONT_SIZES.lg, iconSize: 16 },
  xl: { fontSize: FONT_SIZES.xxl, iconSize: 20 },
};

export const Price: React.FC<PriceProps> = ({
  amount,
  size = 'md',
  color = COLORS.primary,
  style,
}) => {
  const config = sizeConfig[size];

  const textStyle: TextStyle = {
    fontSize: config.fontSize,
    fontWeight: '700',
    color,
  };

  return (
    <View style={[styles.container, style]}>
      <DirhamIcon size={config.iconSize} color={color} />
      <Text style={textStyle}>{amount.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
});

