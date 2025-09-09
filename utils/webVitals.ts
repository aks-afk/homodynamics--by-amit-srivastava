/**
 * Core Web Vitals tracking utility for performance monitoring
 * Implements privacy-conscious performance tracking
 */

interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}

interface AnalyticsConfig {
  enabled: boolean;
  sampleRate: number;
  endpoint?: string;
  debug: boolean;
}

class WebVitalsTracker {
  private config: AnalyticsConfig;
  private metrics: Map<string, WebVitalMetric> = new Map();

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      enabled: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
      sampleRate: parseFloat(import.meta.env.VITE_PERFORMANCE_SAMPLE_RATE || '0.1'),
      debug: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
      ...config
    };

    if (this.config.enabled && this.shouldSample()) {
      this.initializeTracking();
    }
  }

  private shouldSample(): boolean {
    return Math.random() < this.config.sampleRate;
  }

  private initializeTracking(): void {
    // Track Core Web Vitals
    this.trackCLS();
    this.trackFID();
    this.trackFCP();
    this.trackLCP();
    this.trackTTFB();
    
    // Track custom metrics
    this.trackNavigationTiming();
    this.trackResourceTiming();
  }

  private trackCLS(): void {
    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        
        if (clsValue > 0) {
          this.recordMetric('CLS', clsValue);
        }
      });

      try {
        observer.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        // Layout shift not supported
        if (this.config.debug) {
          console.warn('Layout shift tracking not supported:', e);
        }
      }
    }
  }

  private trackFID(): void {
    // First Input Delay
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;
          this.recordMetric('FID', fid);
        }
      });

      try {
        observer.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        // First input not supported
        if (this.config.debug) {
          console.warn('First input delay tracking not supported:', e);
        }
      }
    }
  }

  private trackFCP(): void {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('FCP', entry.startTime);
          }
        }
      });

      try {
        observer.observe({ type: 'paint', buffered: true });
      } catch (e) {
        // Paint timing not supported
        if (this.config.debug) {
          console.warn('Paint timing not supported:', e);
        }
      }
    }
  }

  private trackLCP(): void {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime);
      });

      try {
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        // LCP not supported
        if (this.config.debug) {
          console.warn('Largest contentful paint tracking not supported:', e);
        }
      }
    }
  }

  private trackTTFB(): void {
    // Time to First Byte
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const ttfb = navigationEntries[0].responseStart - navigationEntries[0].requestStart;
        this.recordMetric('TTFB', ttfb);
      }
    }
  }

  private trackNavigationTiming(): void {
    // Custom navigation metrics
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const entry = navigationEntries[0];
        
        // DOM Content Loaded
        const dcl = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
        this.recordMetric('DCL', dcl);
        
        // Load Complete
        const loadComplete = entry.loadEventEnd - entry.loadEventStart;
        this.recordMetric('Load', loadComplete);
        
        // DNS Lookup Time
        const dnsTime = entry.domainLookupEnd - entry.domainLookupStart;
        this.recordMetric('DNS', dnsTime);
        
        // Connection Time
        const connectionTime = entry.connectEnd - entry.connectStart;
        this.recordMetric('Connection', connectionTime);
      }
    }
  }

  private trackResourceTiming(): void {
    // Track resource loading performance
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          
          // Track large resources
          if (resource.transferSize > 100000) { // > 100KB
            const loadTime = resource.responseEnd - resource.requestStart;
            this.recordCustomMetric('LargeResource', {
              name: resource.name,
              size: resource.transferSize,
              loadTime: loadTime,
              type: this.getResourceType(resource.name)
            });
          }
        }
      });

      try {
        observer.observe({ type: 'resource', buffered: true });
      } catch (e) {
        // Resource timing not supported
        if (this.config.debug) {
          console.warn('Resource timing not supported:', e);
        }
      }
    }
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
    return 'other';
  }

  private recordMetric(name: string, value: number): void {
    const metric: WebVitalMetric = {
      name,
      value,
      id: this.generateId(),
      delta: value,
      entries: []
    };

    this.metrics.set(name, metric);

    if (this.config.debug) {
      console.log(`📊 Web Vital: ${name} = ${value.toFixed(2)}ms`);
    }

    // Send to analytics endpoint if configured
    this.sendMetric(metric);
  }

  private recordCustomMetric(name: string, data: any): void {
    if (this.config.debug) {
      console.log(`📊 Custom Metric: ${name}`, data);
    }

    // Send custom metric
    this.sendCustomMetric(name, data);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sendMetric(metric: WebVitalMetric): void {
    // In a real implementation, you would send this to your analytics service
    // For now, we'll just store it locally for debugging
    if (this.config.debug) {
      const stored = JSON.parse(localStorage.getItem('webVitals') || '[]');
      stored.push({
        ...metric,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
      
      // Keep only last 100 entries
      if (stored.length > 100) {
        stored.splice(0, stored.length - 100);
      }
      
      localStorage.setItem('webVitals', JSON.stringify(stored));
    }
  }

  private sendCustomMetric(name: string, data: any): void {
    // Similar to sendMetric, but for custom metrics
    if (this.config.debug) {
      const stored = JSON.parse(localStorage.getItem('customMetrics') || '[]');
      stored.push({
        name,
        data,
        timestamp: Date.now(),
        url: window.location.href
      });
      
      // Keep only last 100 entries
      if (stored.length > 100) {
        stored.splice(0, stored.length - 100);
      }
      
      localStorage.setItem('customMetrics', JSON.stringify(stored));
    }
  }

  // Public methods for manual tracking
  public trackUserInteraction(action: string, target: string): void {
    if (!this.config.enabled) return;

    this.recordCustomMetric('UserInteraction', {
      action,
      target,
      timestamp: Date.now()
    });
  }

  public trackVisualizationLoad(visualizationName: string, loadTime: number): void {
    if (!this.config.enabled) return;

    this.recordCustomMetric('VisualizationLoad', {
      name: visualizationName,
      loadTime,
      timestamp: Date.now()
    });
  }

  public trackSectionView(sectionId: string, timeSpent: number): void {
    if (!this.config.enabled) return;

    this.recordCustomMetric('SectionView', {
      sectionId,
      timeSpent,
      timestamp: Date.now()
    });
  }

  public getMetrics(): Map<string, WebVitalMetric> {
    return new Map(this.metrics);
  }

  public getStoredMetrics(): any[] {
    if (typeof localStorage === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem('webVitals') || '[]');
    } catch {
      return [];
    }
  }
}

// Export singleton instance
export const webVitalsTracker = new WebVitalsTracker();

// Export class for custom instances
export { WebVitalsTracker };

// Export types
export type { WebVitalMetric, AnalyticsConfig };