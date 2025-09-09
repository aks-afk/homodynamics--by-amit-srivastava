import React, { Suspense, lazy, ComponentType } from 'react';

interface LazyVisualizationProps {
  componentPath: string;
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

// Error fallback component
const VisualizationError: React.FC<{ error?: Error; retry?: () => void }> = ({ error, retry }) => (
  <div style={{
    width: '100%',
    height: '300px',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-4)',
    color: 'var(--color-text-muted)',
    fontSize: 'var(--text-sm)',
    textAlign: 'center',
    padding: 'var(--space-6)',
  }}>
    <div style={{
      fontSize: '2rem',
      opacity: 0.5,
    }}>
      ⚠️
    </div>
    <div>
      <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)' }}>
        Visualization temporarily unavailable
      </div>
      <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7 }}>
        {error?.message || 'Failed to load visualization component'}
      </div>
    </div>
    {retry && (
      <button
        onClick={retry}
        style={{
          background: 'var(--color-accent)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-2) var(--space-4)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          transition: 'all var(--transition-normal)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'var(--color-accent-hover)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'var(--color-accent)';
        }}
      >
        Try Again
      </button>
    )}
  </div>
);

// Cache for loaded components to avoid re-importing
const componentCache = new Map<string, ComponentType<any>>();

// Dynamic import function with error handling
const importVisualization = async (componentPath: string): Promise<ComponentType<any>> => {
  if (componentCache.has(componentPath)) {
    return componentCache.get(componentPath)!;
  }

  try {
    const module = await import(/* @vite-ignore */ componentPath);
    const Component = module.default;
    componentCache.set(componentPath, Component);
    return Component;
  } catch (error) {
    console.error(`Failed to load visualization: ${componentPath}`, error);
    throw error;
  }
};

// Error boundary for lazy loaded components
class LazyVisualizationErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyVisualization Error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <VisualizationError error={this.state.error} retry={() => this.setState({ hasError: false, error: undefined })} />;
    }

    return this.props.children;
  }
}

const LazyVisualization: React.FC<LazyVisualizationProps> = ({ 
  componentPath, 
  fallback = <VisualizationSkeleton />,
  onError 
}) => {
  // Create lazy component
  const LazyComponent = React.useMemo(() => {
    return lazy(() => importVisualization(componentPath));
  }, [componentPath]);

  return (
    <LazyVisualizationErrorBoundary onError={onError} fallback={fallback}>
      <Suspense fallback={fallback}>
        <LazyComponent />
      </Suspense>
    </LazyVisualizationErrorBoundary>
  );
};

export default LazyVisualization;

// Add CSS animations to the document if not already present
if (typeof document !== 'undefined') {
  const styleId = 'lazy-visualization-styles';
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