/**
 * ============================================
 * ADD TO CART BUTTON COMPONENT TESTS
 * ============================================
 * 
 * This component has TWO visual states:
 * 1. "Add" button - When item is NOT in cart
 * 2. Quantity controls - When item IS in cart
 * 
 * We test both states thoroughly.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AddToCartButton } from '../../components/AddToCartButton';

describe('AddToCartButton', () => {
  // ----------------------------------------
  // Add Button State Tests
  // ----------------------------------------
  describe('when item is NOT in cart', () => {
    it('should render add button', () => {
      render(
        <AddToCartButton
          isInCart={false}
          onAdd={() => {}}
        />
      );
      
      // Should show cart icon (our mock renders icon name)
      expect(screen.getByText('cart-outline')).toBeTruthy();
    });

    it('should render "Add to Cart" text when not compact', () => {
      render(
        <AddToCartButton
          isInCart={false}
          onAdd={() => {}}
          compact={false}
        />
      );
      
      expect(screen.getByText('Add to Cart')).toBeTruthy();
    });

    it('should NOT render text when compact', () => {
      render(
        <AddToCartButton
          isInCart={false}
          onAdd={() => {}}
          compact={true}
        />
      );
      
      // queryByText returns null if not found (doesn't throw)
      expect(screen.queryByText('Add to Cart')).toBeNull();
    });

    it('should call onAdd when pressed', () => {
      const mockOnAdd = jest.fn();
      
      render(
        <AddToCartButton
          isInCart={false}
          onAdd={mockOnAdd}
        />
      );
      
      fireEvent.press(screen.getByLabelText('Add to cart'));
      
      expect(mockOnAdd).toHaveBeenCalledTimes(1);
    });

    it('should have correct accessibility label', () => {
      render(
        <AddToCartButton
          isInCart={false}
          onAdd={() => {}}
        />
      );
      
      expect(screen.getByLabelText('Add to cart')).toBeTruthy();
    });
  });

  // ----------------------------------------
  // Quantity Controls State Tests
  // ----------------------------------------
  describe('when item IS in cart', () => {
    /**
     * When item is in cart and we have increment/decrement handlers,
     * the component switches to showing quantity controls.
     */
    it('should render quantity controls', () => {
      render(
        <AddToCartButton
          isInCart={true}
          quantity={2}
          onAdd={() => {}}
          onIncrement={() => {}}
          onDecrement={() => {}}
        />
      );
      
      // Should show the quantity
      expect(screen.getByText('2')).toBeTruthy();
      
      // Should show +/- icons
      expect(screen.getByText('remove')).toBeTruthy();
      expect(screen.getByText('add')).toBeTruthy();
    });

    it('should call onIncrement when plus button pressed', () => {
      const mockOnIncrement = jest.fn();
      
      render(
        <AddToCartButton
          isInCart={true}
          quantity={2}
          onAdd={() => {}}
          onIncrement={mockOnIncrement}
          onDecrement={() => {}}
        />
      );
      
      fireEvent.press(screen.getByLabelText('Increase quantity'));
      
      expect(mockOnIncrement).toHaveBeenCalledTimes(1);
    });

    it('should call onDecrement when minus button pressed', () => {
      const mockOnDecrement = jest.fn();
      
      render(
        <AddToCartButton
          isInCart={true}
          quantity={2}
          onAdd={() => {}}
          onIncrement={() => {}}
          onDecrement={mockOnDecrement}
        />
      );
      
      fireEvent.press(screen.getByLabelText('Decrease quantity'));
      
      expect(mockOnDecrement).toHaveBeenCalledTimes(1);
    });

    it('should display correct quantity', () => {
      render(
        <AddToCartButton
          isInCart={true}
          quantity={5}
          onAdd={() => {}}
          onIncrement={() => {}}
          onDecrement={() => {}}
        />
      );
      
      expect(screen.getByText('5')).toBeTruthy();
    });

    /**
     * EDGE CASE: What if isInCart is true but no handlers?
     * The component falls back to the Add button.
     */
    it('should show add button if no increment/decrement handlers', () => {
      render(
        <AddToCartButton
          isInCart={true}
          quantity={2}
          onAdd={() => {}}
          // No onIncrement/onDecrement
        />
      );
      
      // Should show the add button, not quantity controls
      expect(screen.getByLabelText('Add to cart')).toBeTruthy();
    });
  });

  // ----------------------------------------
  // Edge Cases
  // ----------------------------------------
  describe('edge cases', () => {
    it('should default quantity to 0', () => {
      render(
        <AddToCartButton
          isInCart={true}
          onAdd={() => {}}
          onIncrement={() => {}}
          onDecrement={() => {}}
          // No quantity prop
        />
      );
      
      expect(screen.getByText('0')).toBeTruthy();
    });

    it('should handle large quantities', () => {
      render(
        <AddToCartButton
          isInCart={true}
          quantity={999}
          onAdd={() => {}}
          onIncrement={() => {}}
          onDecrement={() => {}}
        />
      );
      
      expect(screen.getByText('999')).toBeTruthy();
    });
  });
});

