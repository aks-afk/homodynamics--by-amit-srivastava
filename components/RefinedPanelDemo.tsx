import React, { useState } from 'react';
import RefinedVisualizationPanel from './RefinedVisualizationPanel';
import DynamicEquilibriumViz from './visualizations/DynamicEquilibriumViz';
import ThermodynamicsViz from './visualizations/ThermodynamicsViz';
import EnergyDomainViz from './visualizations/EnergyDomainViz';

const RefinedPanelDemo: React.FC = () => {
  const [demoState, setDemoState] = useState<'normal' | 'loading' | 'error'>('normal');

  const demoStyles: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  };

  const controlsStyles: React.CSSProperties = {
    marginBottom: '2rem',
    padding: '1rem',
    background: 'var(--color-surface-subtle, #f8f9fa)',
    borderRadius: '8px',
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  };

  const buttonStyles: React.CSSProperties = {
    padding: '0.5rem 1rem',
    border: '1px solid var(--color-border, #e9ecef)',
    borderRadius: '4px',
    background: 'var(--color-surface, #ffffff)',
    cursor: 'pointer',
    fontSize: 'var(--text-sm, 0.875rem)',
    fontFamily: 'var(--font-family-primary, Inter, sans-serif)'
  };

  const activeButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    background: 'var(--color-accent, #2563eb)',
    color: 'white',
    borderColor: 'var(--color-accent, #2563eb)'
  };

  return (
    <div style={demoStyles}>
      <h2 style={{ 
        fontSize: 'var(--text-2xl, 1.5rem)', 
        marginBottom: '1rem',
        color: 'var(--color-text-primary, #1a1a1a)'
      }}>
        Refined Visualization Panel Demo
      </h2>
      
      <div style={controlsStyles}>
        <label style={{ fontSize: 'var(--text-sm, 0.875rem)', fontWeight: 'var(--font-weight-medium, 500)' }}>
          Demo State:
        </label>
        <button
          onClick={() => setDemoState('normal')}
          style={demoState === 'normal' ? activeButtonStyles : buttonStyles}
        >
          Normal
        </button>
        <button
          onClick={() => setDemoState('loading')}
          style={demoState === 'loading' ? activeButtonStyles : buttonStyles}
        >
          Loading
        </button>
        <button
          onClick={() => setDemoState('error')}
          style={demoState === 'error' ? activeButtonStyles : buttonStyles}
        >
          Error
        </button>
      </div>

      {/* Normal state example */}
      <RefinedVisualizationPanel
        title="Dynamic Equilibrium System"
        description="An interactive force simulation demonstrating how systems maintain stability through constant motion and adaptation."
        isLoading={demoState === 'loading'}
        hasError={demoState === 'error'}
        errorMessage="Failed to initialize the force simulation. This could be due to browser compatibility issues."
        onRetry={() => setDemoState('normal')}
      >
        <DynamicEquilibriumViz />
      </RefinedVisualizationPanel>

      {/* Thermodynamics example */}
      <RefinedVisualizationPanel
        title="Thermodynamics of Living Systems"
        description="Explore how living systems maintain order by continuously processing energy and dissipating entropy to their environment."
        isLoading={demoState === 'loading'}
        hasError={demoState === 'error'}
        errorMessage="Unable to load thermodynamics visualization. Please check your browser's JavaScript support."
        onRetry={() => setDemoState('normal')}
      >
        <ThermodynamicsViz />
      </RefinedVisualizationPanel>

      {/* Energy Domain example */}
      <RefinedVisualizationPanel
        title="Energy Domain: Fortitude"
        description="Interactive exploration of the energy domain, showing how attention, vitality, focus, and flow work together to create psychological fortitude."
        isLoading={demoState === 'loading'}
        hasError={demoState === 'error'}
        errorMessage="Energy domain visualization failed to load. This may be due to missing D3.js dependencies."
        onRetry={() => setDemoState('normal')}
      >
        <EnergyDomainViz />
      </RefinedVisualizationPanel>

      {/* Usage instructions */}
      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        background: 'var(--color-surface-subtle, #f8f9fa)',
        borderRadius: '8px',
        borderLeft: '4px solid var(--color-accent, #2563eb)'
      }}>
        <h3 style={{ 
          fontSize: 'var(--text-lg, 1.125rem)', 
          marginBottom: '1rem',
          color: 'var(--color-text-primary, #1a1a1a)'
        }}>
          Usage Instructions
        </h3>
        <p style={{ 
          fontSize: 'var(--text-sm, 0.875rem)', 
          lineHeight: 'var(--line-height-relaxed, 1.625)',
          color: 'var(--color-text-secondary, #4a4a4a)',
          marginBottom: '1rem'
        }}>
          The RefinedVisualizationPanel component provides:
        </p>
        <ul style={{ 
          fontSize: 'var(--text-sm, 0.875rem)', 
          lineHeight: 'var(--line-height-relaxed, 1.625)',
          color: 'var(--color-text-secondary, #4a4a4a)',
          paddingLeft: '1.5rem'
        }}>
          <li>Elegant fade-in animations with intersection observer</li>
          <li>Skeleton loading states with shimmer effects</li>
          <li>Comprehensive error handling with retry functionality</li>
          <li>Full accessibility support with ARIA labels</li>
          <li>Responsive design that works on all devices</li>
          <li>Respect for user motion preferences</li>
        </ul>
      </div>
    </div>
  );
};

export default RefinedPanelDemo;