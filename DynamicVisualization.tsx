import React from 'react';
import { performanceMonitor } from '../utils/performanceMonitor';
import VisualizationErrorBoundary from './VisualizationErrorBoundary';

interface DynamicVisualizationProps {
  Component: React.ComponentType<any>;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

// Visualization loading skeleton
const VisualizationSkeleton: React.FC = () => (
  <div style={{
    width: '100%',
    height: '300px',
    background: 'linear-gradient(90deg, var(--color-surface-subtle) 25%, var(--color-border-subtle) 50%, var(--color-surface-subtle) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-muted)',
    fontSize: 'var(--text-sm)',
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-2)',
    }}>
      <div style={{
        width: '24px',
        height: '24px',
        border: '2px solid var(--color-border)',
        borderTop: '2px solid var(--color-accent)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <span>Loading visualization...</span>
    </div>
  </div>
);



const DynamicVisualization: React.FC<DynamicVisualizationProps> = ({
  Component,
  fallback = <VisualizationSkeleton />,
  onError
}) => {
  const componentName = Component?.name || 'Unknown';

  // Performance monitoring
  React.useEffect(() => {
    if (Component && Component.name !== 'DummyViz') {
      performanceMonitor.startComponentLoad(componentName);
      performanceMonitor.startComponentRender(componentName);

      return () => {
        performanceMonitor.endComponentRender(componentName);
      };
    }
  }, [Component, componentName]);

  // Wrap the component in Suspense for potential lazy loading
  const WrappedComponent = React.useMemo(() => {
    // If the component is already loaded, render it directly
    if (Component && Component.name !== 'DummyViz') {
      const ComponentWrapper: React.FC = () => {
        React.useEffect(() => {
          performanceMonitor.endComponentLoad(componentName, true);
        }, []);

        return React.createElement(Component);
      };
      return ComponentWrapper;
    }

    // Return a dummy component for empty visualizations
    return () => null;
  }, [Component, componentName]);

  if (!Component || Component.name === 'DummyViz') {
    return null;
  }

  const handleError = (error: Error) => {
    performanceMonitor.endComponentLoad(componentName, false);
    onError?.(error);
  };

  return React.createElement(
    VisualizationErrorBoundary,
    {
      visualizationName: componentName,
      onError: handleError,
      fallback: fallback,
    },
    React.createElement(
      React.Suspense,
      { fallback: fallback },
      React.createElement(WrappedComponent)
    )
  );
};

export default DynamicVisualization;

// Add CSS animations to the document if not already present
if (typeof document !== 'undefined') {
  const styleId = 'dynamic-visualization-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}