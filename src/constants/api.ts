export const API_CONFIG = {
  BASE_URL: 'https://mocki.io/v1',
  PRODUCTS_ENDPOINT: '/c53fb45e-5085-487a-afac-0295f62fb86e',
} as const;

export const PRODUCTS_API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}`;

export const STORAGE_KEYS = {
  FAVORITES: '@ecommerce_favorites',
  CART: '@ecommerce_cart',
} as const;

export const DEEP_LINK_CONFIG = {
  SCHEME: 'myshoplite',
  WEB_PREFIXES: ['http://localhost:8081', 'https://localhost:8081'],
} as const;
