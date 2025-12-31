/**
 * ============================================
 * PRODUCT CARD COMPONENT TESTS
 * ============================================
 * 
 * ProductCard is a complex component that:
 * - Displays product info
 * - Contains FavoriteButton (child component)
 * - Contains AddToCartButton (child component)
 * - Handles press events for navigation
 * 
 * TESTING STRATEGY:
 * 
 * When testing components with children, you have two options:
 * 
 * 1. INTEGRATION TEST: Test the full tree (children included)
 *    - Pro: Tests real behavior
 *    - Con: Slower, more complex assertions
 * 
 * 2. UNIT TEST: Mock child components
 *    - Pro: Faster, focused tests
 *    - Con: May miss integration issues
 * 
 * We use integration testing here since the component tree is small.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ProductCard } from '../../components/ProductCard';
import type { Product } from '../../types';

// Test data - create a factory function for reusable test products
const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: 'https://example.com/image.jpg',
  description: 'Test description',
  ...overrides,
});

describe('ProductCard', () => {
  // ----------------------------------------
  // Rendering Tests
  // ----------------------------------------
  describe('rendering', () => {
    it('should display product name', () => {
      const product = createMockProduct({ name: 'Amazing Widget' });
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
        />
      );
      
      expect(screen.getByText('Amazing Widget')).toBeTruthy();
    });

    it('should display product price', () => {
      const product = createMockProduct({ price: 149.99 });
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
        />
      );
      
      // Price should be formatted
      expect(screen.getByText('149.99')).toBeTruthy();
    });

    it('should render product image', () => {
      const product = createMockProduct();
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
        />
      );
      
      // Check image accessibility label
      expect(screen.getByLabelText('Image of Test Product')).toBeTruthy();
    });
  });

  // ----------------------------------------
  // Favorite Button Tests
  // ----------------------------------------
  describe('favorite button', () => {
    it('should show favorite button by default', () => {
      const product = createMockProduct();
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
          onToggleFavorite={() => {}}
        />
      );
      
      // Should show heart icon
      expect(screen.getByText('heart-outline')).toBeTruthy();
    });

    it('should hide favorite button when showFavoriteButton is false', () => {
      const product = createMockProduct();
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
          showFavoriteButton={false}
        />
      );
      
      // Should not show heart icons
      expect(screen.queryByText('heart-outline')).toBeNull();
      expect(screen.queryByText('heart')).toBeNull();
    });

    it('should show filled heart when favorited', () => {
      const product = createMockProduct();
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
          isFavorite={true}
          onToggleFavorite={() => {}}
        />
      );
      
      expect(screen.getByText('heart')).toBeTruthy();
    });

    it('should call onToggleFavorite when favorite button pressed', () => {
      const mockToggle = jest.fn();
      const product = createMockProduct();
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
          onToggleFavorite={mockToggle}
        />
      );
      
      fireEvent.press(screen.getByLabelText(/favorites/));
      
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });

  // ----------------------------------------
  // Cart Button Tests
  // ----------------------------------------
  describe('cart button', () => {
    it('should show cart button by default', () => {
      const product = createMockProduct();
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
          onAddToCart={() => {}}
        />
      );
      
      expect(screen.getByLabelText('Add to cart')).toBeTruthy();
    });

    it('should hide cart button when showCartButton is false', () => {
      const product = createMockProduct();
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
          showCartButton={false}
        />
      );
      
      expect(screen.queryByLabelText('Add to cart')).toBeNull();
    });

    it('should show quantity controls when item is in cart', () => {
      const product = createMockProduct();
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
          isInCart={true}
          cartQuantity={3}
          onAddToCart={() => {}}
          onIncrementCart={() => {}}
          onDecrementCart={() => {}}
        />
      );
      
      expect(screen.getByText('3')).toBeTruthy();
    });

    it('should call onAddToCart when add button pressed', () => {
      const mockAddToCart = jest.fn();
      const product = createMockProduct();
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
          onAddToCart={mockAddToCart}
        />
      );
      
      fireEvent.press(screen.getByLabelText('Add to cart'));
      
      expect(mockAddToCart).toHaveBeenCalledTimes(1);
    });

    it('should call onIncrementCart when increment pressed', () => {
      const mockIncrement = jest.fn();
      const product = createMockProduct();
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
          isInCart={true}
          cartQuantity={1}
          onAddToCart={() => {}}
          onIncrementCart={mockIncrement}
          onDecrementCart={() => {}}
        />
      );
      
      fireEvent.press(screen.getByLabelText('Increase quantity'));
      
      expect(mockIncrement).toHaveBeenCalledTimes(1);
    });

    it('should call onDecrementCart when decrement pressed', () => {
      const mockDecrement = jest.fn();
      const product = createMockProduct();
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
          isInCart={true}
          cartQuantity={2}
          onAddToCart={() => {}}
          onIncrementCart={() => {}}
          onDecrementCart={mockDecrement}
        />
      );
      
      fireEvent.press(screen.getByLabelText('Decrease quantity'));
      
      expect(mockDecrement).toHaveBeenCalledTimes(1);
    });
  });

  // ----------------------------------------
  // Press/Navigation Tests
  // ----------------------------------------
  describe('press handling', () => {
    it('should call onPress when card is pressed', () => {
      const mockOnPress = jest.fn();
      const product = createMockProduct();
      
      render(
        <ProductCard
          product={product}
          onPress={mockOnPress}
        />
      );
      
      // The main card is a Pressable with role "button"
      // Use the accessibility label to find it
      const card = screen.getByLabelText(/Test Product.*Dirhams/);
      fireEvent.press(card);
      
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  // ----------------------------------------
  // Accessibility Tests
  // ----------------------------------------
  describe('accessibility', () => {
    it('should have correct accessibility label with product info', () => {
      const product = createMockProduct({
        name: 'Super Widget',
        price: 50.00,
      });
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
        />
      );
      
      // Label should include name and price
      expect(
        screen.getByLabelText('Super Widget, 50.00 Dirhams')
      ).toBeTruthy();
    });

    it('should have accessibility hint for navigation', () => {
      const product = createMockProduct();
      
      render(
        <ProductCard
          product={product}
          onPress={() => {}}
        />
      );
      
      const card = screen.getByRole('button', { name: /Test Product/ });
      expect(card.props.accessibilityHint).toBe('Double tap to view product details');
    });
  });
});

