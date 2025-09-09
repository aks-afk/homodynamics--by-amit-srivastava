import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorMonitor } from '../utils/errorMonitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  enableRetry?: boolean;
  context?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  public state: State = {
    hasError: false,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Report error to new monitoring system
    errorMonitor.reportReactError(error, errorInfo);

    // Report error to monitoring service (in production)
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real application, you would send this to an error reporting service
    // like Sentry, LogRocket, or Bugsnag
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: this.props.context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.log('Error report:', errorReport);
    
    // Example: Send to error reporting service
    // errorReportingService.captureException(error, { extra: errorReport });
  };

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: this.state.retryCount + 1,
      });
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private getErrorMessage = (error?: Error): string => {
    if (!error) return 'An unexpected error occurred';

    // Provide user-friendly messages for common errors
    if (error.message.includes('ChunkLoadError')) {
      return 'Failed to load application resources. This might be due to a network issue or an updated version of the site.';
    }
    
    if (error.message.includes('Loading chunk')) {
      return 'Failed to load part of the application. Please check your internet connection.';
    }
    
    if (error.message.includes('Network Error')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
    
    if (error.message.includes('Script error')) {
      return 'A script loading error occurred. This might be due to browser extensions or network issues.';
    }

    return 'An unexpected error occurred while loading this content.';
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.props.enableRetry && this.state.retryCount < this.maxRetries;
      const errorMessage = this.getErrorMessage(this.state.error);

      return (
        <div style={{
          padding: 'var(--space-8)',
          textAlign: 'center',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-surface)',
          margin: 'var(--space-6) 0',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: 'var(--space-4)',
            opacity: 0.6,
          }}>
            ⚠️
          </div>
          
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            color: 'var(--color-text-primary)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--space-4)',
          }}>
            {this.props.context ? `Error in ${this.props.context}` : 'Something went wrong'}
          </h2>
          
          <p style={{
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--line-height-relaxed)',
            marginBottom: 'var(--space-6)',
            maxWidth: '500px',
            margin: '0 auto var(--space-6) auto',
          }}>
            {errorMessage}
          </p>

          <div style={{
            display: 'flex',
            gap: 'var(--space-3)',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {canRetry && (
              <button
                onClick={this.handleRetry}
                style={{
                  background: 'var(--color-accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-3) var(--space-6)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
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
                Try Again ({this.maxRetries - this.state.retryCount} attempts left)
              </button>
            )}
            
            <button
              onClick={this.handleReload}
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-3) var(--space-6)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--color-surface-subtle)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--color-surface)';
              }}
            >
              Reload Page
            </button>
          </div>

          {this.props.showErrorDetails && this.state.error && (
            <details style={{
              marginTop: 'var(--space-6)',
              textAlign: 'left',
            }}>
              <summary style={{
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-3)',
              }}>
                Show technical details
              </summary>
              <pre style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                backgroundColor: 'var(--color-surface-subtle)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid var(--color-border)',
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack && (
                  <>
                    {'\n\nComponent Stack:'}
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </pre>
            </details>
          )}

          {this.state.retryCount >= this.maxRetries && (
            <div style={{
              marginTop: 'var(--space-6)',
              padding: 'var(--space-4)',
              background: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
            }}>
              If the problem persists, please try refreshing the page or contact support.
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
