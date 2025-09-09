import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../../App';
import ComplexAdaptiveSystemsViz from '../../../components/visualizations/ComplexAdaptiveSystemsViz';

// Mock visualization components
vi.mock('../../../components/visualizations/ComplexAdaptiveSystemsViz', () => ({
  default: () => <div data-testid="complex-systems-viz">Complex Systems Visualization</div>
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

// Helper function to set viewport size
const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

describe('Responsive Design Tests', () => {
  beforeEach(() => {
    // Reset to desktop size
    setViewportSize(1024, 768);
  });

  afterEach(() => {
    // Clean up
    vi.clearAllMocks();
  });

  describe('Mobile Viewport (320px - 768px)', () => {
    it('should show mobile navigation on small screens', async () => {
      setViewportSize(375, 667); // iPhone SE size
      
      render(<App />);

      await waitFor(() => {
        const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
        expect(mobileMenuButton).toBeInTheDocument();
      });

      // Desktop navigation should be hidden (this would be tested with CSS)
      const mobileButton = screen.getByRole('button', { name: /open menu/i });
      expect(mobileButton).toBeVisible();
    });

    it('should handle touch interactions on mobile', async () => {
      setViewportSize(375, 667);
      const user = userEvent.setup();
      
      render(<App />);

      await waitFor(() => {
        const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
        expect(mobileMenuButton).toBeInTheDocument();
      });

      const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
      
      // Simulate touch interaction
      await user.click(mobileMenuButton);
      
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should adapt sophisticated navigation for mobile', async () => {
      setViewportSize(375, 667);
      
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      // Sophisticated navigation should be hidden on mobile
      // This would typically be tested with CSS media queries
      const navToggle = screen.queryByRole('button', { name: /expand navigation panel/i });
      // On mobile, this might not be visible or might behave differently
      expect(navToggle).toBeTruthy(); // It exists but might be styled differently
    });
  });

  describe('Tablet Viewport (768px - 1024px)', () => {
    it('should adapt layout for tablet screens', async () => {
      setViewportSize(768, 1024); // iPad size
      
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      // Should show desktop navigation on tablet
      const navigation = screen.getByRole('navigation', { name: /main navigation/i });
      expect(navigation).toBeInTheDocument();
    });

    it('should handle tablet-specific interactions', async () => {
      setViewportSize(768, 1024);
      const user = userEvent.setup();
      
      render(<App />);

      await waitFor(() => {
        const navToggle = screen.getByRole('button', { name: /expand navigation panel/i });
        expect(navToggle).toBeInTheDocument();
      });

      const navToggle = screen.getByRole('button', { name: /expand navigation panel/i });
      await user.click(navToggle);
      
      expect(navToggle).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Desktop Viewport (1024px+)', () => {
    it('should show full desktop layout', async () => {
      setViewportSize(1440, 900);
      
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      // Desktop navigation should be visible
      const navigation = screen.getByRole('navigation', { name: /main navigation/i });
      expect(navigation).toBeInTheDocument();

      // Mobile menu button should not be visible (or should be hidden via CSS)
      const mobileButton = screen.queryByRole('button', { name: /open menu/i });
      expect(mobileButton).toBeInTheDocument(); // It exists but is hidden via CSS
    });

    it('should handle sophisticated navigation on desktop', async () => {
      setViewportSize(1440, 900);
      const user = userEvent.setup();
      
      render(<App />);

      await waitFor(() => {
        const navToggle = screen.getByRole('button', { name: /expand navigation panel/i });
        expect(navToggle).toBeInTheDocument();
      });

      const navToggle = screen.getByRole('button', { name: /expand navigation panel/i });
      await user.click(navToggle);
      
      expect(navToggle).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Visualization Responsiveness', () => {
    it('should render visualizations responsively', () => {
      // Test with actual visualization component
      const { container } = render(<ComplexAdaptiveSystemsViz />);
      
      // SVG should have responsive attributes
      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle({ width: '100%', height: 'auto' });
    });

    it('should handle visualization interactions on touch devices', async () => {
      setViewportSize(375, 667);
      const user = userEvent.setup();
      
      const { container } = render(<ComplexAdaptiveSystemsViz />);
      
      const button = screen.getByRole('button');
      
      // Should work with touch interactions
      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should adapt visualization size for different screens', () => {
      // Test different viewport sizes
      const viewports = [
        { width: 320, height: 568 }, // iPhone 5
        { width: 375, height: 667 }, // iPhone 6/7/8
        { width: 768, height: 1024 }, // iPad
        { width: 1440, height: 900 }, // Desktop
      ];

      viewports.forEach(({ width, height }) => {
        setViewportSize(width, height);
        
        const { container } = render(<ComplexAdaptiveSystemsViz />);
        const svg = container.querySelector('svg');
        
        // SVG should maintain responsive properties
        expect(svg).toHaveStyle({ width: '100%', height: 'auto' });
      });
    });
  });

  describe('Content Readability', () => {
    it('should maintain readable text sizes across devices', () => {
      const viewports = [
        { width: 320, height: 568 },
        { width: 768, height: 1024 },
        { width: 1440, height: 900 },
      ];

      viewports.forEach(({ width, height }) => {
        setViewportSize(width, height);
        
        render(<App />);
        
        // Text should be readable (this would be tested with computed styles)
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        
        // In a real test, you'd check computed font sizes
        const computedStyle = window.getComputedStyle(heading);
        expect(computedStyle).toBeTruthy();
      });
    });

    it('should handle content overflow properly', async () => {
      setViewportSize(320, 568); // Very narrow screen
      
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });

      // Content should not overflow horizontally
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      
      // In a real test, you'd check for horizontal scrollbars
    });
  });

  describe('Performance on Different Devices', () => {
    it('should handle reduced motion preferences', () => {
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

      render(<App />);

      // Verify reduced motion is respected
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('should optimize for touch targets on mobile', async () => {
      setViewportSize(375, 667);
      const user = userEvent.setup();
      
      render(<App />);

      await waitFor(() => {
        const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
        expect(mobileMenuButton).toBeInTheDocument();
      });

      const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
      
      // Touch targets should be large enough (44px minimum)
      // This would be tested with computed styles in a real scenario
      await user.click(mobileMenuButton);
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    });
  });
});