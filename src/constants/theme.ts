export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',

  background: '#F2F2F7',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  textInverse: '#FFFFFF',

  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',

  border: '#C6C6C8',
  divider: '#E5E5EA',
  overlay: 'rgba(0, 0, 0, 0.5)',

  favorite: '#FF3B30',
  favoriteInactive: '#C7C7CC',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const FONT_SIZES = {
  xxs: 10,
  xs: 10,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  title: 28,
} as const;

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
} as const;

export const GRID = {
  mobileColumns: 1,
  tabletColumns: 2,
  gap: SPACING.md,
} as const;

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
} as const;

export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;
