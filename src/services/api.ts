import type { Product } from '../types';
import productsData from '../data/products.json';

const SIMULATED_DELAY_MS = 500;

export const fetchProductsFromAPI = async (): Promise<Product[]> => {
  // Simulate network delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
  return productsData as Product[];
};

export const fetchProductById = async (
  productId: string
): Promise<Product | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS / 2));
  const products = productsData as Product[];
  return products.find((product) => product.id === productId);
};

export const searchProducts = (
  products: Product[],
  searchQuery: string
): Product[] => {
  if (!searchQuery.trim()) {
    return products;
  }

  const query = searchQuery.toLowerCase().trim();
  return products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );
};

