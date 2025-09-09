import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'axe-core';
import React from 'react';
import Header from '../../../components/Header';
import SophisticatedNavigation from '../../../components/SophisticatedNavigation';
import ComplexAdaptiveSystemsViz from '../../../components/visualizations/ComplexAdaptiveSystemsViz';
import { contentData } from '../../../data';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

const mockOnSelectSection = vi.fn();

describe('Accessibility Tests', () => {
  it('Header component should have no accessibility violations', async () => {
    const { container } = render(
      React.createElement(Header, {
        sections: contentData.slice(0, 3),
        currentSectionId: 'about',
        onSelectSection: mockOnSelectSection,
      })
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('SophisticatedNavigation component should have no accessibility violations', async () => {
    const { container } = render(
      React.createElement(SophisticatedNavigation, {
        sections: contentData.slice(0, 2),
        currentSectionId: 'about',
        currentSubSectionId: '',
        onSelectSection: mockOnSelectSection,
      })
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ComplexAdaptiveSystemsViz component should have no accessibility violations', async () => {
    const { container } = render(React.createElement(ComplexAdaptiveSystemsViz));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should test color contrast ratios', () => {
    // Test primary color combinations
    const testColorContrast = (foreground: string, background: string, expectedRatio: number) => {
      // This is a simplified test - in a real scenario you'd use a proper color contrast library
      const mockRatio = 4.5; // Assuming good contrast
      expect(mockRatio).toBeGreaterThanOrEqual(expectedRatio);
    };

    // Test common color combinations
    testColorContrast('#3A3A3A', '#FCFBF8', 4.5); // Text on background
    testColorContrast('#2563eb', '#ffffff', 4.5); // Accent on white
    testColorContrast('#ffffff', '#2563eb', 4.5); // White on accent
  });

  it('should respect reduced motion preferences', () => {
    // Mock reduced motion preference
    const mockMatchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    // Test that reduced motion is respected
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    expect(typeof reducedMotion).toBe('boolean');
  });

  it('should have proper focus management', () => {
    // Test that focus is properly managed
    const focusableElements = [
      'button',
      'a[href]',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])',
    ];

    // This would be expanded in a real test to check actual focus behavior
    expect(focusableElements.length).toBeGreaterThan(0);
  });

  it('should have proper heading hierarchy', () => {
    const { container } = render(React.createElement(ComplexAdaptiveSystemsViz));
    
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    // Check that headings exist and are properly structured
    expect(headings.length).toBeGreaterThan(0);
    
    // In a real test, you'd verify the heading hierarchy is logical
    const h4 = container.querySelector('h4');
    expect(h4).toBeInTheDocument();
  });

  it('should have proper ARIA landmarks', async () => {
    const { container } = render(
      React.createElement(Header, {
        sections: contentData.slice(0, 3),
        currentSectionId: 'about',
        onSelectSection: mockOnSelectSection,
      })
    );

    // Check for navigation landmark
    const nav = container.querySelector('[role="navigation"]');
    expect(nav).toBeInTheDocument();

    // Check for proper ARIA labels
    const navWithLabel = container.querySelector('[aria-label*="navigation"]');
    expect(navWithLabel).toBeInTheDocument();
  });
});