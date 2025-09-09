// Performance monitoring utilities for bundle optimization

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  bundleSize: number;
  chunkCount: number;
  memoryUsage?: number;
}

export interface ComponentMetrics {
  componentName: string;
  loadTime: number;
  renderTime: number;
  errorCount: number;
  successCount: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, ComponentMetrics> = new Map();
  private startTimes: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start timing a component load
  startComponentLoad(componentName: string): void {
    this.startTimes.set(`${componentName}-load`, performance.now());
  }

  // End timing a component load
  endComponentLoad(componentName: string, success: boolean = true): void {
    const startTime = this.startTimes.get(`${componentName}-load`);
    if (startTime) {
      const loadTime = performance.now() - startTime;
      this.updateComponentMetrics(componentName, { loadTime }, success);
      this.startTimes.delete(`${componentName}-load`);
    }
  }

  // Start timing a component render
  startComponentRender(componentName: string): void {
    this.startTimes.set(`${componentName}-render`, performance.now());
  }

  // End timing a component render
  endComponentRender(componentName: string): void {
    const startTime = this.startTimes.get(`${componentName}-render`);
    if (startTime) {
      const renderTime = performance.now() - startTime;
      this.updateComponentMetrics(componentName, { renderTime });
      this.startTimes.delete(`${componentName}-render`);
    }
  }

  // Update component metrics
  private updateComponentMetrics(
    componentName: string, 
    updates: Partial<ComponentMetrics>,
    success: boolean = true
  ): void {
    const existing = this.metrics.get(componentName) || {
      componentName,
      loadTime: 0,
      renderTime: 0,
      errorCount: 0,
      successCount: 0,
    };

    const updated: ComponentMetrics = {
      ...existing,
      ...updates,
      errorCount: success ? existing.errorCount : existing.errorCount + 1,
      successCount: success ? existing.successCount + 1 : existing.successCount,
    };

    this.metrics.set(componentName, updated);
  }

  // Get metrics for a specific component
  getComponentMetrics(componentName: string): ComponentMetrics | undefined {
    return this.metrics.get(componentName);
  }

  // Get all component metrics
  getAllMetrics(): ComponentMetrics[] {
    return Array.from(this.metrics.values());
  }

  // Get performance summary
  getPerformanceSummary(): {
    totalComponents: number;
    averageLoadTime: number;
    averageRenderTime: number;
    errorRate: number;
    slowestComponents: ComponentMetrics[];
  } {
    const allMetrics = this.getAllMetrics();
    const totalComponents = allMetrics.length;

    if (totalComponents === 0) {
      return {
        totalComponents: 0,
        averageLoadTime: 0,
        averageRenderTime: 0,
        errorRate: 0,
        slowestComponents: [],
      };
    }

    const totalLoadTime = allMetrics.reduce((sum, m) => sum + m.loadTime, 0);
    const totalRenderTime = allMetrics.reduce((sum, m) => sum + m.renderTime, 0);
    const totalErrors = allMetrics.reduce((sum, m) => sum + m.errorCount, 0);
    const totalAttempts = allMetrics.reduce((sum, m) => sum + m.successCount + m.errorCount, 0);

    const slowestComponents = allMetrics
      .sort((a, b) => (b.loadTime + b.renderTime) - (a.loadTime + a.renderTime))
      .slice(0, 5);

    return {
      totalComponents,
      averageLoadTime: totalLoadTime / totalComponents,
      averageRenderTime: totalRenderTime / totalComponents,
      errorRate: totalAttempts > 0 ? totalErrors / totalAttempts : 0,
      slowestComponents,
    };
  }

  // Log performance summary to console (development only)
  logPerformanceSummary(): void {
    if (process.env.NODE_ENV !== 'development') return;

    const summary = this.getPerformanceSummary();
    console.group('🚀 Performance Summary');
    console.log(`Total Components: ${summary.totalComponents}`);
    console.log(`Average Load Time: ${summary.averageLoadTime.toFixed(2)}ms`);
    console.log(`Average Render Time: ${summary.averageRenderTime.toFixed(2)}ms`);
    console.log(`Error Rate: ${(summary.errorRate * 100).toFixed(2)}%`);
    
    if (summary.slowestComponents.length > 0) {
      console.log('Slowest Components:');
      summary.slowestComponents.forEach((comp, index) => {
        console.log(`  ${index + 1}. ${comp.componentName}: ${(comp.loadTime + comp.renderTime).toFixed(2)}ms`);
      });
    }
    console.groupEnd();
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics.clear();
    this.startTimes.clear();
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Web Vitals monitoring
export const measureWebVitals = (): void => {
  if (typeof window === 'undefined') return;

  // Measure Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'navigation') {
        const navEntry = entry as PerformanceNavigationTiming;
        console.log('Navigation Timing:', {
          domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
          loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
          firstByte: navEntry.responseStart - navEntry.requestStart,
        });
      }

      if (entry.entryType === 'paint') {
        console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
      }

      if (entry.entryType === 'largest-contentful-paint') {
        console.log(`LCP: ${entry.startTime.toFixed(2)}ms`);
      }
    });
  });

  // Observe different entry types
  try {
    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
  } catch (error) {
    console.warn('Performance Observer not supported:', error);
  }
};

// Bundle size estimation
export const estimateBundleSize = (): Promise<number> => {
  return new Promise((resolve) => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      // Use Network Information API if available
      const connection = (navigator as any).connection;
      const estimatedSize = connection.downlink * 1024 * 1024 / 8; // Convert Mbps to bytes
      resolve(estimatedSize);
    } else {
      // Fallback estimation based on performance timing
      const timing = performance.timing;
      const transferSize = timing.responseEnd - timing.responseStart;
      resolve(transferSize);
    }
  });
};

// Memory usage monitoring
export const getMemoryUsage = (): number | undefined => {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    return memory.usedJSHeapSize;
  }
  return undefined;
};

// Chunk loading monitoring
export const monitorChunkLoading = (): void => {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;
  let chunkCount = 0;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    
    // Check if this is a chunk request
    const url = args[0] as string;
    if (url.includes('/assets/') && url.includes('.js')) {
      chunkCount++;
      console.log(`Chunk loaded: ${url} (Total chunks: ${chunkCount})`);
    }
    
    return response;
  };
};

// Initialize performance monitoring
export const initPerformanceMonitoring = (): void => {
  if (process.env.NODE_ENV === 'development') {
    measureWebVitals();
    monitorChunkLoading();
    
    // Log performance summary every 30 seconds
    setInterval(() => {
      performanceMonitor.logPerformanceSummary();
    }, 30000);
  }
};