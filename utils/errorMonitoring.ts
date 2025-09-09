/**
 * Error monitoring and reporting utility
 * Implements privacy-conscious error tracking
 */

interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  url: string;
  line?: number;
  column?: number;
  timestamp: number;
  userAgent: string;
  type: 'javascript' | 'unhandledrejection' | 'react' | 'visualization' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  userId?: string; // Anonymous user ID if tracking is enabled
}

interface ErrorMonitoringConfig {
  enabled: boolean;
  sampleRate: number;
  maxErrors: number;
  endpoint?: string;
  debug: boolean;
  enableStackTrace: boolean;
}

class ErrorMonitor {
  private config: ErrorMonitoringConfig;
  private errors: ErrorReport[] = [];
  private errorCounts: Map<string, number> = new Map();

  constructor(config: Partial<ErrorMonitoringConfig> = {}) {
    this.config = {
      enabled: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
      sampleRate: parseFloat(import.meta.env.VITE_ERROR_REPORTING_SAMPLE_RATE || '1.0'),
      maxErrors: 100,
      debug: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
      enableStackTrace: true,
      ...config
    };

    if (this.config.enabled) {
      this.initializeErrorHandlers();
    }
  }

  private initializeErrorHandlers(): void {
    // Global JavaScript error handler
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        line: event.lineno,
        column: event.colno,
        type: 'javascript',
        severity: this.determineSeverity(event.error),
        context: {
          target: event.target?.tagName,
          source: event.filename
        }
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        url: window.location.href,
        type: 'unhandledrejection',
        severity: 'high',
        context: {
          reason: event.reason
        }
      });
    });

    // Console error override for additional context
    if (this.config.debug) {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        this.handleError({
          message: args.join(' '),
          url: window.location.href,
          type: 'custom',
          severity: 'medium',
          context: {
            consoleArgs: args
          }
        });
        originalConsoleError.apply(console, args);
      };
    }
  }

  private shouldSample(): boolean {
    return Math.random() < this.config.sampleRate;
  }

  private determineSeverity(error: Error | any): 'low' | 'medium' | 'high' | 'critical' {
    if (!error) return 'low';

    const message = error.message?.toLowerCase() || '';
    
    // Critical errors
    if (message.includes('chunk load failed') || 
        message.includes('loading chunk') ||
        message.includes('network error')) {
      return 'critical';
    }

    // High severity errors
    if (message.includes('typeerror') ||
        message.includes('referenceerror') ||
        message.includes('syntaxerror')) {
      return 'high';
    }

    // Medium severity errors
    if (message.includes('warning') ||
        message.includes('deprecated')) {
      return 'medium';
    }

    return 'low';
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleError(errorData: Partial<ErrorReport>): void {
    if (!this.config.enabled || !this.shouldSample()) {
      return;
    }

    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      message: errorData.message || 'Unknown error',
      stack: this.config.enableStackTrace ? errorData.stack : undefined,
      url: errorData.url || window.location.href,
      line: errorData.line,
      column: errorData.column,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      type: errorData.type || 'custom',
      severity: errorData.severity || 'medium',
      context: errorData.context || {}
    };

    // Check for duplicate errors
    const errorKey = `${errorReport.message}_${errorReport.line}_${errorReport.column}`;
    const count = this.errorCounts.get(errorKey) || 0;
    
    if (count >= 5) {
      // Don't report the same error more than 5 times
      return;
    }
    
    this.errorCounts.set(errorKey, count + 1);

    // Add to local storage
    this.errors.push(errorReport);
    
    // Keep only the most recent errors
    if (this.errors.length > this.config.maxErrors) {
      this.errors.shift();
    }

    // Store in localStorage for debugging
    if (this.config.debug) {
      this.storeErrorLocally(errorReport);
    }

    // Log to console in debug mode
    if (this.config.debug) {
      console.group(`🚨 Error Report [${errorReport.severity.toUpperCase()}]`);
      console.error('Message:', errorReport.message);
      console.error('URL:', errorReport.url);
      if (errorReport.line) console.error('Line:', errorReport.line);
      if (errorReport.column) console.error('Column:', errorReport.column);
      if (errorReport.stack) console.error('Stack:', errorReport.stack);
      if (errorReport.context) console.error('Context:', errorReport.context);
      console.groupEnd();
    }

    // Send to external service (placeholder)
    this.sendErrorReport(errorReport);
  }

  private storeErrorLocally(errorReport: ErrorReport): void {
    try {
      const stored = JSON.parse(localStorage.getItem('errorReports') || '[]');
      stored.push(errorReport);
      
      // Keep only last 50 errors
      if (stored.length > 50) {
        stored.splice(0, stored.length - 50);
      }
      
      localStorage.setItem('errorReports', JSON.stringify(stored));
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  private sendErrorReport(errorReport: ErrorReport): void {
    // In a real implementation, you would send this to your error reporting service
    // For now, we'll just prepare the data structure
    
    if (this.config.endpoint) {
      // Example of how you might send to an external service
      fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...errorReport,
          // Remove sensitive information
          userAgent: this.sanitizeUserAgent(errorReport.userAgent),
          url: this.sanitizeUrl(errorReport.url)
        })
      }).catch(() => {
        // Silently fail - don't create more errors
      });
    }
  }

  private sanitizeUserAgent(userAgent: string): string {
    // Remove potentially sensitive information from user agent
    return userAgent.replace(/\([^)]*\)/g, '(...)');
  }

  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove query parameters and hash that might contain sensitive data
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch {
      return 'invalid-url';
    }
  }

  // Public methods for manual error reporting
  public reportError(error: Error | string, context?: Record<string, any>, severity?: 'low' | 'medium' | 'high' | 'critical'): void {
    const errorData: Partial<ErrorReport> = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      type: 'custom',
      severity: severity || 'medium',
      context
    };

    this.handleError(errorData);
  }

  public reportReactError(error: Error, errorInfo: any): void {
    this.handleError({
      message: error.message,
      stack: error.stack,
      type: 'react',
      severity: 'high',
      context: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    });
  }

  public reportVisualizationError(visualizationName: string, error: Error | string, context?: Record<string, any>): void {
    this.handleError({
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      type: 'visualization',
      severity: 'medium',
      context: {
        visualizationName,
        ...context
      }
    });
  }

  public getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  public getStoredErrors(): ErrorReport[] {
    if (typeof localStorage === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem('errorReports') || '[]');
    } catch {
      return [];
    }
  }

  public clearErrors(): void {
    this.errors = [];
    this.errorCounts.clear();
    
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('errorReports');
    }
  }

  public getErrorStats(): { total: number; bySeverity: Record<string, number>; byType: Record<string, number> } {
    const stats = {
      total: this.errors.length,
      bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
      byType: { javascript: 0, unhandledrejection: 0, react: 0, visualization: 0, custom: 0 }
    };

    this.errors.forEach(error => {
      stats.bySeverity[error.severity]++;
      stats.byType[error.type]++;
    });

    return stats;
  }
}

// Export singleton instance
export const errorMonitor = new ErrorMonitor();

// Export class for custom instances
export { ErrorMonitor };

// Export types
export type { ErrorReport, ErrorMonitoringConfig };