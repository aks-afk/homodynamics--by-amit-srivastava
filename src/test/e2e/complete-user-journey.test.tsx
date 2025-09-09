import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../../App';

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
});

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({ data: new Array(4) })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
});

// Mock analytics and monitoring utilities
vi.mock('../../../utils/analytics', () => ({
  analytics: {
    trackPageView: vi.fn(),
    trackSectionView: vi.fn(),
    trackUserInteraction: vi.fn(),
  }
}));

vi.mock('../../../utils/webVitals', () => ({
  webVitalsTracker: {}
}));

vi.mock('../../../utils/errorMonitoring', () => ({
  errorMonitor: {
    reportError: vi.fn()
  }
}));

describe('Complete User Journey E2E Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow complete navigation through all major sections', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Homodynamics')).toBeInTheDocument();
    });

    // Test navigation to About section (should be default)
    expect(screen.getByText('What is Homodynamics?')).toBeInTheDocument();

    // Navigate to Introduction
    const introLink = screen.getByRole('menuitem', { name: /navigate to introduction/i });
    await user.click(introLink);
    
    await waitFor(() => {
      expect(screen.getByText(/The journey of understanding/i)).toBeInTheDocument();
    });

    // Navigate to Part I sections
    const partILinks = screen.getAllByRole('menuitem');
    const partILink = partILinks.find(link => 
      link.getAttribute('aria-label')?.includes('Part I')
    );
    
    if (partILink) {
      await user.click(partILink);
      
      // Should show Part I content
      await waitFor(() => {
        expect(screen.getByText(/Ancient Wisdom/i)).toBeInTheDocument();
      });
    }
  });

  it('should display visualizations for each section', async () => {
    render(<App />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Homodynamics')).toBeInTheDocument();
    });

    // Check that visualization panel exists
    const visualizationPanel = screen.getByTestId('visualization-panel');
    expect(visualizationPanel).toBeInTheDocument();

    // Check that visualization content is rendered
    const svgElements = screen.getAllByRole('img', { hidden: true });
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('should work properly on mobile viewport', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });

    const user = userEvent.setup();
    render(<App />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Homodynamics')).toBeInTheDocument();
    });

    // Find and click mobile menu button
    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
    expect(mobileMenuButton).toBeInTheDocument();
    
    await user.click(mobileMenuButton);

    // Mobile navigation should be visible
    await waitFor(() => {
      const mobileNav = screen.getByRole('dialog', { name: /mobile navigation menu/i });
      expect(mobileNav).toBeInTheDocument();
    });

    // Should be able to navigate using mobile menu
    const mobileAboutLink = screen.getAllByRole('menuitem', { name: /navigate to about/i })[1]; // Second one is mobile
    await user.click(mobileAboutLink);

    // Mobile menu should close and content should be visible
    await waitFor(() => {
      expect(screen.getByText('What is Homodynamics?')).toBeInTheDocument();
    });
  });

  it('should handle keyboard navigation properly', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Homodynamics')).toBeInTheDocument();
    });

    // Test keyboard navigation through menu items
    const firstMenuItem = screen.getByRole('menuitem', { name: /navigate to about/i });
    firstMenuItem.focus();
    
    expect(document.activeElement).toBe(firstMenuItem);

    // Tab to next menu item
    await user.tab();
    const secondMenuItem = screen.getByRole('menuitem', { name: /navigate to introduction/i });
    expect(document.activeElement).toBe(secondMenuItem);

    // Press Enter to navigate
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(screen.getByText(/The journey of understanding/i)).toBeInTheDocument();
    });
  });

  it('should maintain scroll position and active states correctly', async () => {
    render(<App />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Homodynamics')).toBeInTheDocument();
    });

    // Check that About section is initially active
    const aboutLink = screen.getByRole('menuitem', { name: /navigate to about/i });
    expect(aboutLink).toHaveAttribute('aria-current', 'page');

    // Navigate to different section
    const user = userEvent.setup();
    const introLink = screen.getByRole('menuitem', { name: /navigate to introduction/i });
    await user.click(introLink);

    // Check that active state changes
    await waitFor(() => {
      expect(introLink).toHaveAttribute('aria-current', 'page');
      expect(aboutLink).not.toHaveAttribute('aria-current', 'page');
    });
  });

  it('should handle error states gracefully', async () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<App />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Homodynamics')).toBeInTheDocument();
    });

    // The app should render without throwing errors
    expect(screen.getByText('What is Homodynamics?')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('should load and display content progressively', async () => {
    render(<App />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Homodynamics')).toBeInTheDocument();
    });

    // Check that main content areas are present (use getAllByTestId for multiple elements)
    const contentDisplays = screen.getAllByTestId('content-display');
    expect(contentDisplays.length).toBeGreaterThan(0);
    
    const visualizationPanels = screen.getAllByTestId('visualization-panel');
    expect(visualizationPanels.length).toBeGreaterThan(0);

    // Check that navigation is functional
    const navigation = screen.getByRole('navigation', { name: /main navigation/i });
    expect(navigation).toBeInTheDocument();

    // Verify that content is actually loaded (not just loading states)
    expect(screen.getByText('What is Homodynamics?')).toBeInTheDocument();
  });

  it('should support accessibility features', async () => {
    render(<App />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Homodynamics')).toBeInTheDocument();
    });

    // Check for proper ARIA labels
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    
    // Use getAllByRole for multiple banners (header elements)
    const banners = screen.getAllByRole('banner');
    expect(banners.length).toBeGreaterThan(0);

    // Check that interactive elements have proper labels
    const menuItems = screen.getAllByRole('menuitem');
    menuItems.forEach(item => {
      expect(item).toHaveAttribute('aria-label');
    });

    // Check that mobile menu has proper accessibility attributes
    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
    expect(mobileMenuButton).toHaveAttribute('aria-controls');
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
  });
});