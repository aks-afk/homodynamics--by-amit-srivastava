import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComplexAdaptiveSystemsViz from '../../../components/visualizations/ComplexAdaptiveSystemsViz';

describe('ComplexAdaptiveSystemsViz Component', () => {
  it('renders with proper accessibility attributes', () => {
    render(<ComplexAdaptiveSystemsViz />);
    
    // Check for heading
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Complex Adaptive Systems');
    
    // Check for SVG with proper ARIA attributes
    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('aria-label', 'Complex Adaptive Systems visualization showing individual agents and emergent properties');
    expect(svg).toHaveAttribute('aria-describedby', 'complex-systems-description');
    expect(svg).toHaveAttribute('tabindex', '0');
  });

  it('has accessible button with proper ARIA attributes', () => {
    render(<ComplexAdaptiveSystemsViz />);
    
    const button = screen.getByRole('button', { name: /show emergence/i });
    expect(button).toHaveAttribute('aria-describedby', 'emergence-button-description');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('updates ARIA attributes when emergence is toggled', async () => {
    const user = userEvent.setup();
    render(<ComplexAdaptiveSystemsViz />);
    
    const button = screen.getByRole('button', { name: /show emergence/i });
    
    // Initially not pressed
    expect(button).toHaveAttribute('aria-pressed', 'false');
    
    // Click to show emergence
    await user.click(button);
    
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveTextContent('Hide Emergence');
  });

  it('supports keyboard interaction on SVG', async () => {
    const user = userEvent.setup();
    render(<ComplexAdaptiveSystemsViz />);
    
    const svg = screen.getByRole('img');
    
    // Focus the SVG
    svg.focus();
    expect(document.activeElement).toBe(svg);
    
    // Press Enter to toggle emergence
    await user.keyboard('{Enter}');
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('provides descriptive text for screen readers', () => {
    render(<ComplexAdaptiveSystemsViz />);
    
    // Check for description element
    const description = document.getElementById('complex-systems-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(/eight individual agents/);
    
    // Check for button description
    const buttonDescription = document.getElementById('emergence-button-description');
    expect(buttonDescription).toBeInTheDocument();
  });

  it('updates description when emergence state changes', async () => {
    const user = userEvent.setup();
    render(<ComplexAdaptiveSystemsViz />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    const description = document.getElementById('complex-systems-description');
    expect(description).toHaveTextContent(/three emergent properties/);
    
    const buttonDescription = document.getElementById('emergence-button-description');
    expect(buttonDescription).toHaveTextContent(/hide the emergent properties/i);
  });

  it('has proper explanatory text with semantic markup', () => {
    render(<ComplexAdaptiveSystemsViz />);
    
    const explanation = screen.getByRole('note');
    expect(explanation).toHaveAttribute('aria-label', 'Explanation of complex adaptive systems');
    expect(explanation).toHaveTextContent(/individual agents interact/i);
  });

  it('maintains focus properly during interactions', async () => {
    const user = userEvent.setup();
    render(<ComplexAdaptiveSystemsViz />);
    
    const button = screen.getByRole('button');
    const svg = screen.getByRole('img');
    
    // Test tab navigation
    await user.tab();
    expect(document.activeElement).toBe(svg);
    
    await user.tab();
    expect(document.activeElement).toBe(button);
  });
});