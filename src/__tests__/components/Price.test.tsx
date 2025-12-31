/**
 * ============================================
 * PRICE COMPONENT TESTS
 * ============================================
 * 
 * The Price component displays a formatted price with a Dirham icon.
 * 
 * TESTING STRATEGY:
 * 
 * 1. Test that the price is formatted correctly
 * 2. Test different size variants
 * 3. Test edge cases (0, large numbers, decimals)
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Price } from '../../components/Price';

describe('Price', () => {
  // ----------------------------------------
  // Basic Rendering
  // ----------------------------------------
  describe('rendering', () => {
    it('should display the formatted price', () => {
      render(<Price amount={99.99} />);
      
      expect(screen.getByText('99.99')).toBeTruthy();
    });

    it('should format whole numbers with 2 decimal places', () => {
      render(<Price amount={100} />);
      
      expect(screen.getByText('100.00')).toBeTruthy();
    });

    it('should round to 2 decimal places', () => {
      render(<Price amount={99.999} />);
      
      // toFixed(2) rounds 99.999 to 100.00
      expect(screen.getByText('100.00')).toBeTruthy();
    });
  });

  // ----------------------------------------
  // Edge Cases
  // ----------------------------------------
  describe('edge cases', () => {
    it('should display zero correctly', () => {
      render(<Price amount={0} />);
      
      expect(screen.getByText('0.00')).toBeTruthy();
    });

    it('should handle very large numbers', () => {
      render(<Price amount={999999.99} />);
      
      expect(screen.getByText('999999.99')).toBeTruthy();
    });

    it('should handle small decimal amounts', () => {
      render(<Price amount={0.01} />);
      
      expect(screen.getByText('0.01')).toBeTruthy();
    });

    it('should handle single decimal amounts', () => {
      render(<Price amount={9.9} />);
      
      // Should still show 2 decimal places
      expect(screen.getByText('9.90')).toBeTruthy();
    });
  });

  // ----------------------------------------
  // Size Variants
  // ----------------------------------------
  describe('size variants', () => {
    /**
     * For style testing, we can check that the component
     * renders without errors at each size. 
     * 
     * Visual testing (checking actual pixel sizes) would
     * require snapshot testing or visual regression tools.
     */
    it('should render at sm size', () => {
      render(<Price amount={50} size="sm" />);
      expect(screen.getByText('50.00')).toBeTruthy();
    });

    it('should render at md size (default)', () => {
      render(<Price amount={50} size="md" />);
      expect(screen.getByText('50.00')).toBeTruthy();
    });

    it('should render at lg size', () => {
      render(<Price amount={50} size="lg" />);
      expect(screen.getByText('50.00')).toBeTruthy();
    });

    it('should render at xl size', () => {
      render(<Price amount={50} size="xl" />);
      expect(screen.getByText('50.00')).toBeTruthy();
    });
  });
});

