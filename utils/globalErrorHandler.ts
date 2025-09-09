// Global error handling utilities

export interface ErrorReport {
  type: 'javascript' | 'promise' | 'resource' | 'network';
  message: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  error?: Error;
  stack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
}

class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 50;
  private isOnline = navigator.onLine;

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  constructor() {
    this.setupErrorHandlers();
    this.setupNetworkHandlers();
  }

  private setupErrorHandlers(): void {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      const errorReport: ErrorReport = {
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      this.handleError(errorReport);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const errorReport: ErrorReport = {
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        error: event.reason instanceof Error ? event.reason : undefined,
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      this.handleError(errorReport);
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement;
        const errorReport: ErrorReport = {
          type: 'resource',
          message: `Failed to load resource: ${target.tagName}`,
          filename: (target as any).src || (target as any).href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        };

        this.handleError(errorReport);
      }
    }, true);
  }

  private setupNetworkHandlers(): void {
    // Monitor network status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private handleError(errorReport: ErrorReport): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error caught:', errorReport);
    }

    // Add to queue
    this.addToQueue(errorReport);

    // Try to send immediately if online
    if (this.isOnline) {
      this.flushErrorQueue();
    }

    // Show user notification for critical errors
    this.showUserNotification(errorReport);
  }

  private addToQueue(errorReport: ErrorReport): void {
    this.errorQueue.push(errorReport);
    
    // Keep queue size manageable
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  private async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0 || !this.isOnline) {
      return;
    }

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await this.sendErrorReports(errorsToSend);
    } catch (error) {
      console.warn('Failed to send error reports:', error);
      // Put errors back in queue
      this.errorQueue.unshift(...errorsToSend);
    }
  }

  private async sendErrorReports(errors: ErrorReport[]): Promise<void> {
    // In a real application, send to error reporting service
    // For now, just log them
    console.log('Sending error reports:', errors);

    // Example implementation:
    // try {
    //   await fetch('/api/errors', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ errors }),
    //   });
    // } catch (error) {
    //   throw new Error('Failed to send error reports');
    // }
  }

  private showUserNotification(errorReport: ErrorReport): void {
    // Only show notifications for critical errors
    const criticalErrors = ['ChunkLoadError', 'Network Error', 'Script error'];
    const isCritical = criticalErrors.some(error => 
      errorReport.message.includes(error)
    );

    if (!isCritical) return;

    // Create a subtle notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-4);
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      max-width: 300px;
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: var(--space-2);">
        <span style="font-size: 1.2em;">⚠️</span>
        <div>
          <div style="font-weight: var(--font-weight-semibold); margin-bottom: var(--space-1);">
            Connection Issue
          </div>
          <div style="font-size: var(--text-xs); opacity: 0.8;">
            Some features may not work properly. Please refresh if issues persist.
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: none; border: none; cursor: pointer; opacity: 0.6;">
          ✕
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Public methods for manual error reporting
  public reportError(error: Error, context?: string): void {
    const errorReport: ErrorReport = {
      type: 'javascript',
      message: context ? `${context}: ${error.message}` : error.message,
      error,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.handleError(errorReport);
  }

  public getErrorStats(): {
    totalErrors: number;
    errorsByType: Record<string, number>;
    recentErrors: ErrorReport[];
  } {
    const errorsByType: Record<string, number> = {};
    
    this.errorQueue.forEach(error => {
      errorsByType[error.type] = (errorsByType[error.type] || 0) + 1;
    });

    return {
      totalErrors: this.errorQueue.length,
      errorsByType,
      recentErrors: this.errorQueue.slice(-10),
    };
  }
}

// Export singleton instance
export const globalErrorHandler = GlobalErrorHandler.getInstance();

// Initialize global error handling
export const initGlobalErrorHandling = (): void => {
  // Add CSS for notification animations
  if (typeof document !== 'undefined') {
    const styleId = 'global-error-handler-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  console.log('Global error handling initialized');
};