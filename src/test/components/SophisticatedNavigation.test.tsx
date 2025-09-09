import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SophisticatedNavigation from '../../../components/SophisticatedNavigation';
import { contentData } from '../../../data';

const mockOnSelectSection = vi.fn();

const defaultProps = {
  sections: contentData.slice(0, 2),
  currentSectionId: 'about',
  currentSubSectionId: '',
  onSelectSection: mockOnSelectSection,
};

describe('SophisticatedNavigation Component', () => {
  beforeEach(() => {
    mockOnSelectSection.mockClear();
  });

  it('renders with proper accessibility attributes', () => {
    render(<SophisticatedNavigation {...defaultProps} />);
    
    const toggleButton = screen.getByRole('button', { name: /expand navigation panel/i });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(toggleButton).toHaveAttribute('aria-controls', 'navigation-content');
  });

  it('toggles expansion state with proper ARIA updates', async () => {
    const user = userEvent.setup();
    render(<SophisticatedNavigation {...defaultProps} />);
    
    const toggleButton = screen.getByRole('button', { name: /expand navigation panel/i });
    
    // Initially collapsed
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    
    // Expand
    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(toggleButton).toHaveAttribute('aria-label', 'Collapse navigation panel');
  });

  it('renders breadcrumb navigation with proper semantics', async () => {
    const user = userEvent.setup();
    render(<SophisticatedNavigation {...defaultProps} />);
    
    // Expand to see content
    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);
    
    const breadcrumbNav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(breadcrumbNav).toBeInTheDocument();
  });

  it('renders table of contents with proper navigation', async () => {
    const user = userEvent.setup();
    render(<SophisticatedNavigation {...defaultProps} />);
    
    // Expand to see content
    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);
    
    const tocNav = screen.getByRole('navigation', { name: /table of contents/i });
    expect(tocNav).toBeInTheDocument();
  });

  it('handles keyboard navigation properly', async () => {
    const user = userEvent.setup();
    render(<SophisticatedNavigation {...defaultProps} />);
    
    const toggleButton = screen.getByRole('button');
    
    // Should be focusable
    await user.tab();
    expect(document.activeElement).toBe(toggleButton);
    
    // Should respond to Enter key
    await user.keyboard('{Enter}');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('provides proper navigation context', async () => {
    const user = userEvent.setup();
    render(<SophisticatedNavigation {...defaultProps} />);
    
    // Expand navigation
    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);
    
    // Should show current path information
    expect(screen.getByText('Current Path')).toBeInTheDocument();
    expect(screen.getByText('Contents')).toBeInTheDocument();
  });

  it('handles section navigation correctly', async () => {
    const user = userEvent.setup();
    render(<SophisticatedNavigation {...defaultProps} />);
    
    // Expand navigation
    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);
    
    // Find and click a navigation link
    const navLinks = screen.getAllByRole('link');
    if (navLinks.length > 0) {
      await user.click(navLinks[0]);
      expect(mockOnSelectSection).toHaveBeenCalled();
    }
  });

  it('maintains focus management during interactions', async () => {
    const user = userEvent.setup();
    render(<SophisticatedNavigation {...defaultProps} />);
    
    const toggleButton = screen.getByRole('button');
    
    // Focus should be maintained properly
    toggleButton.focus();
    expect(document.activeElement).toBe(toggleButton);
    
    await user.keyboard('{Enter}');
    // After expansion, focus should still be manageable
    expect(document.activeElement).toBe(toggleButton);
  });
});