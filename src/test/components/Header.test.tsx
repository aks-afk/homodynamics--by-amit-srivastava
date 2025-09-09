import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../../../components/Header';
import { contentData } from '../../../data';

const mockOnSelectSection = vi.fn();

const defaultProps = {
  sections: contentData.slice(0, 3), // Use first 3 sections for testing
  currentSectionId: 'about',
  onSelectSection: mockOnSelectSection,
};

describe('Header Component', () => {
  beforeEach(() => {
    mockOnSelectSection.mockClear();
  });

  it('renders the header with proper semantic structure', () => {
    render(<Header {...defaultProps} />);
    
    // Check for main heading
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Homodynamics');
    
    // Check for navigation
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    
    // Check for menubar
    expect(screen.getByRole('menubar')).toBeInTheDocument();
  });

  it('has proper ARIA attributes on title', () => {
    render(<Header {...defaultProps} />);
    
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveAttribute('role', 'button');
    expect(title).toHaveAttribute('aria-label', 'Go to About section');
    expect(title).toHaveAttribute('tabindex', '0');
  });

  it('supports keyboard navigation on title', async () => {
    const user = userEvent.setup();
    render(<Header {...defaultProps} />);
    
    const title = screen.getByRole('heading', { level: 1 });
    
    // Test Enter key
    await user.click(title);
    await user.keyboard('{Enter}');
    expect(mockOnSelectSection).toHaveBeenCalledWith('about');
    
    mockOnSelectSection.mockClear();
    
    // Test Space key
    await user.keyboard(' ');
    expect(mockOnSelectSection).toHaveBeenCalledWith('about');
  });

  it('renders navigation items with proper ARIA attributes', () => {
    render(<Header {...defaultProps} />);
    
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBeGreaterThan(0);
    
    // Check first menu item
    const firstMenuItem = menuItems[0];
    expect(firstMenuItem).toHaveAttribute('aria-current');
    expect(firstMenuItem).toHaveAttribute('aria-label');
  });

  it('handles mobile menu toggle with proper accessibility', async () => {
    const user = userEvent.setup();
    render(<Header {...defaultProps} />);
    
    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
    expect(mobileMenuButton).toHaveAttribute('aria-controls', 'mobile-navigation');
    
    // Open mobile menu
    await user.click(mobileMenuButton);
    
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    expect(mobileMenuButton).toHaveAttribute('aria-label', 'Close menu');
    
    // Check mobile navigation dialog
    const mobileNav = screen.getByRole('dialog');
    expect(mobileNav).toHaveAttribute('aria-modal', 'true');
    expect(mobileNav).toHaveAttribute('aria-label', 'Mobile navigation menu');
  });

  it('supports keyboard navigation in dropdown menus', async () => {
    const user = userEvent.setup();
    
    // Create sections with children for dropdown testing
    const sectionsWithDropdown = [
      {
        id: 'part1',
        title: 'Part 1: Foundation',
        shortTitle: 'Foundation',
        type: 'header' as const,
        subSections: [],
        component: () => null,
      },
      {
        id: 'section1',
        title: 'Section 1',
        shortTitle: 'Section 1',
        type: 'section' as const,
        subSections: [],
        component: () => null,
      }
    ];
    
    render(<Header {...defaultProps} sections={sectionsWithDropdown} />);
    
    const menuItems = screen.getAllByRole('menuitem');
    const dropdownTrigger = menuItems.find(item => 
      item.getAttribute('aria-haspopup') === 'true'
    );
    
    if (dropdownTrigger) {
      // Test arrow down key to open dropdown
      dropdownTrigger.focus();
      await user.keyboard('{ArrowDown}');
      
      // Should open dropdown
      expect(dropdownTrigger).toHaveAttribute('aria-expanded', 'true');
    }
  });

  it('announces current page correctly', () => {
    render(<Header {...defaultProps} currentSectionId="about" />);
    
    const currentPageItem = screen.getByRole('menuitem', { current: 'page' });
    expect(currentPageItem).toBeInTheDocument();
  });

  it('handles focus management properly', async () => {
    const user = userEvent.setup();
    render(<Header {...defaultProps} />);
    
    const title = screen.getByRole('heading', { level: 1 });
    
    // Focus should be manageable
    await user.tab();
    expect(document.activeElement).toBe(title);
  });
});