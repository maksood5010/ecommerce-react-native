/**
 * ============================================
 * FAVORITE BUTTON COMPONENT TESTS
 * ============================================
 * 
 * Component testing with React Native Testing Library.
 * 
 * KEY CONCEPTS:
 * 
 * 1. RENDERING: Use render() to mount the component
 * 2. QUERYING: Use screen.getBy*, screen.queryBy*, screen.findBy* to find elements
 * 3. EVENTS: Use fireEvent to simulate user interactions
 * 4. ASSERTIONS: Use Jest matchers + RNTL matchers
 * 
 * QUERY PRIORITY (from most to least recommended):
 * 
 * 1. getByRole / getByLabelText - Best for accessibility
 * 2. getByText - Good for visible text
 * 3. getByTestId - Last resort when above options don't work
 * 
 * QUERY VARIANTS:
 * 
 * - getBy*   : Throws error if not found (use when element MUST exist)
 * - queryBy* : Returns null if not found (use when testing absence)
 * - findBy*  : Returns promise, waits for element (use for async)
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { FavoriteButton } from '../../components/FavoriteButton';

describe('FavoriteButton', () => {
  // ----------------------------------------
  // Rendering Tests
  // ----------------------------------------
  describe('rendering', () => {
    it('should render heart-outline icon when not favorited', () => {
      render(
        <FavoriteButton
          isFavorite={false}
          onToggle={() => {}}
          productName="Test Product"
        />
      );
      
      // Since we mock Ionicons to render the icon name as text,
      // we can check for the icon name
      expect(screen.getByText('heart-outline')).toBeTruthy();
    });

    it('should render filled heart icon when favorited', () => {
      render(
        <FavoriteButton
          isFavorite={true}
          onToggle={() => {}}
          productName="Test Product"
        />
      );
      
      expect(screen.getByText('heart')).toBeTruthy();
    });
  });

  // ----------------------------------------
  // Accessibility Tests
  // ----------------------------------------
  describe('accessibility', () => {
    /**
     * ACCESSIBILITY TESTING:
     * 
     * Proper accessibility labels are crucial for:
     * - Screen readers
     * - Voice control
     * - Automated testing
     * 
     * We use getByRole and getByLabelText to ensure
     * the component is accessible.
     */
    it('should have correct accessibility label when not favorited', () => {
      render(
        <FavoriteButton
          isFavorite={false}
          onToggle={() => {}}
          productName="Test Product"
        />
      );
      
      const button = screen.getByRole('button');
      // Check accessibilityState is set
      expect(button.props.accessibilityState).toEqual({ selected: false });
    });

    it('should have correct accessibility label when favorited', () => {
      render(
        <FavoriteButton
          isFavorite={true}
          onToggle={() => {}}
          productName="Test Product"
        />
      );
      
      const button = screen.getByRole('button');
      expect(button.props.accessibilityState).toEqual({ selected: true });
    });

    it('should include product name in accessibility label', () => {
      render(
        <FavoriteButton
          isFavorite={false}
          onToggle={() => {}}
          productName="Awesome Gadget"
        />
      );
      
      // The button should be labeled with the product name
      expect(
        screen.getByLabelText('Add Awesome Gadget to favorites')
      ).toBeTruthy();
    });
  });

  // ----------------------------------------
  // Interaction Tests
  // ----------------------------------------
  describe('interactions', () => {
    /**
     * TESTING USER INTERACTIONS:
     * 
     * 1. Create a mock function with jest.fn()
     * 2. Pass it as a prop
     * 3. Simulate the interaction with fireEvent
     * 4. Assert the mock was called correctly
     */
    it('should call onToggle when pressed', () => {
      // Arrange: Create a mock function
      const mockOnToggle = jest.fn();
      
      render(
        <FavoriteButton
          isFavorite={false}
          onToggle={mockOnToggle}
          productName="Test Product"
        />
      );
      
      // Act: Simulate press
      const button = screen.getByRole('button');
      fireEvent.press(button);
      
      // Assert: Check mock was called
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('should call onToggle when favorited and pressed', () => {
      const mockOnToggle = jest.fn();
      
      render(
        <FavoriteButton
          isFavorite={true}
          onToggle={mockOnToggle}
          productName="Test Product"
        />
      );
      
      fireEvent.press(screen.getByRole('button'));
      
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });
  });

  // ----------------------------------------
  // Props Tests
  // ----------------------------------------
  describe('props', () => {
    it('should use default product name when not provided', () => {
      render(
        <FavoriteButton
          isFavorite={false}
          onToggle={() => {}}
        />
      );
      
      // Default is "product"
      expect(
        screen.getByLabelText('Add product to favorites')
      ).toBeTruthy();
    });
  });
});

