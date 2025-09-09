import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  visualizationName?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class VisualizationErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Visualization error in ${this.props.visualizationName || 'unknown'}:`, error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Report visualization-specific error
    this.reportVisualizationError(error, errorInfo);
  }

  private reportVisualizationError = (error: Error, errorInfo: ErrorInfo) => {
    const errorReport = {
      type: 'visualization_error',
      visualizationName: this.props.visualizationName,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.log('Visualization error report:', errorReport);
    
    // In production, send to error reporting service
    // errorReportingService.captureException(error, { 
    //   tags: { component: 'visualization' },
    //   extra: errorReport 
    // });
  };

  private getVisualizationErrorMessage = (error?: Error): string => {
    if (!error) return 'Visualization failed to load';

    // D3-specific errors
    if (error.message.includes('d3') || error.message.includes('selection')) {
      return 'The interactive visualization encountered a rendering issue. The content is still available in text form.';
    }

    // Canvas/SVG errors
    if (error.message.includes('canvas') || error.message.includes('svg')) {
      return 'The visualization graphics could not be rendered. This might be due to browser compatibility issues.';
    }

    // Data processing errors
    if (error.message.includes('data') || error.message.includes('undefined')) {
      return 'The visualization data could not be processed correctly.';
    }

    return 'The interactive visualization is temporarily unavailable.';
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.getVisualizationErrorMessage(this.state.error);

      return (
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
            📊
          </div>
          
          <div>
            <div style={{ 
              fontWeight: 'var(--font-weight-semibold)', 
              marginBottom: 'var(--space-2)',
              color: 'var(--color-text-secondary)',
            }}>
              Visualization Unavailable
            </div>
            <div style={{ 
              fontSize: 'var(--text-xs)', 
              opacity: 0.8,
              maxWidth: '280px',
              lineHeight: 'var(--line-height-relaxed)',
            }}>
              {errorMessage}
            </div>
          </div>

          <button
            onClick={this.handleRetry}
            style={{
              background: 'var(--color-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--text-xs)',
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
            Retry Visualization
          </button>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginTop: 'var(--space-4)',
              fontSize: 'var(--text-xs)',
              width: '100%',
            }}>
              <summary style={{
                cursor: 'pointer',
                opacity: 0.7,
              }}>
                Debug Info
              </summary>
              <pre style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                backgroundColor: 'var(--color-surface-subtle)',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                marginTop: 'var(--space-2)',
                maxHeight: '100px',
                overflowY: 'auto',
                textAlign: 'left',
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default VisualizationErrorBoundary;