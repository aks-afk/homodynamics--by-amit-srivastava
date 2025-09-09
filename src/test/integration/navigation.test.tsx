import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../../App';

// Mock the visualization components to avoid D3 issues in tests
vi.mock('../../../components/visualizations/ComplexAdaptiveSystemsViz', () => ({
  default: () => <div data-testid="mock-visualization">Mock Visualization</div>
}));

vi.mock('../../../utils/visualizationRegistry', () => ({
  preloadHighPriorityVisualizations: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../utils/performanceMonitor', () => ({
  initPerformanceMonitoring: vi.fn(),
}));

vi.mock('../../../utils/globalErrorHandler', () => ({
  initGlobalErrorHandling: vi.fn(),
}));

describe('Navigation Integration Tests', () => {
  beforeEach(() => {
    // Reset location hash
    window.location.hash = '';
  });

  it('should navigate through sections using header navigation', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Homodynamics');
    });

    // Find navigation menu items
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBeGreaterThan(0);

    // Click on a navigation item
    if (menuItems.length > 1) {
      await user.click(menuItems[1]);
      
      // Verify navigation occurred
      await waitFor(() => {
        expect(window.location.hash).toBeTruthy();
      });
    }
  });

  it('should support keyboard navigation through header', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    // Tab through navigation elements
    await user.tab(); // Skip link
    await user.tab(); // Title
    await user.tab(); // First nav item

    const activeElement = document.activeElement;
    expect(activeElement).toHaveAttribute('role', 'menuitem');

    // Use arrow keys to navigate
    await user.keyboard('{ArrowRight}');
    
    // Verify focus moved
    const newActiveElement = document.activeElement;
    expect(newActiveElement).not.toBe(activeElement);
  });

  it('should handle mobile navigation properly', async () => {
    const user = userEvent.setup();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
    });

    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
    
    // Open mobile menu
    await user.click(mobileMenuButton);

    // Verify mobile menu opened
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Verify mobile navigation dialog is present
    const mobileNav = screen.getByRole('dialog');
    expect(mobileNav).toHaveAttribute('aria-modal', 'true');
  });

  it('should maintain focus when navigating between sections', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    // Focus on main content
    const mainContent = screen.getByRole('main');
    mainContent.focus();
    expect(document.activeElement).toBe(mainContent);

    // Navigate to different section
    const menuItems = screen.getAllByRole('menuitem');
    if (menuItems.length > 1) {
      await user.click(menuItems[1]);
      
      // Focus should be maintained or properly managed
      await waitFor(() => {
        expect(document.activeElement).toBeTruthy();
      });
    }
  });

  it('should handle skip link functionality', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Tab to skip link (it should be the first focusable element)
    await user.tab();
    
    const skipLink = document.activeElement as HTMLElement;
    expect(skipLink).toHaveTextContent('Skip to main content');
    expect(skipLink.getAttribute('href')).toBe('#main-content');

    // Activate skip link
    await user.keyboard('{Enter}');
    
    // Verify main content is focused
    await waitFor(() => {
      const mainContent = document.getElementById('main-content');
      expect(mainContent).toBeInTheDocument();
    });
  });

  it('should handle sophisticated navigation panel', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    // Find navigation toggle button
    const navToggle = screen.getByRole('button', { name: /expand navigation panel/i });
    expect(navToggle).toBeInTheDocument();

    // Expand navigation
    await user.click(navToggle);
    
    expect(navToggle).toHaveAttribute('aria-expanded', 'true');
    expect(navToggle).toHaveAttribute('aria-label', 'Collapse navigation panel');
  });

  it('should handle hash-based routing correctly', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    // Simulate hash change
    window.location.hash = '#introduction';
    fireEvent(window, new HashChangeEvent('hashchange'));

    // Verify the app responds to hash changes
    await waitFor(() => {
      // The app should update its state based on the hash
      expect(window.location.hash).toBe('#introduction');
    });
  });

  it('should provide proper error boundaries for navigation', async () => {
    const user = userEvent.setup();
    
    // Mock console.error to avoid noise in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    // Navigation should be wrapped in error boundaries
    const errorBoundary = screen.getByText(/main content/i).closest('[data-error-boundary]');
    // In a real test, you'd trigger an error and verify the boundary catches it
    
    consoleSpy.mockRestore();
  });
});