/**
 * Privacy-conscious analytics utility
 * Tracks user interactions while respecting privacy
 */

interface AnalyticsEvent {
  id: string;
  name: string;
  category: 'navigation' | 'interaction' | 'visualization' | 'content' | 'performance';
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  properties?: Record<string, any>;
}

interface UserSession {
  id: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  interactions: number;
  timeSpent: number;
}

interface AnalyticsConfig {
  enabled: boolean;
  respectDoNotTrack: boolean;
  sessionTimeout: number; // in milliseconds
  maxEvents: number;
  debug: boolean;
  endpoint?: string;
}

class Analytics {
  private config: AnalyticsConfig;
  private events: AnalyticsEvent[] = [];
  private session: UserSession;
  private startTime: number;
  private lastActivityTime: number;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      enabled: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      respectDoNotTrack: true,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      maxEvents: 1000,
      debug: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
      ...config
    };

    this.startTime = Date.now();
    this.lastActivityTime = this.startTime;

    // Check if tracking is allowed
    if (!this.isTrackingAllowed()) {
      this.config.enabled = false;
    }

    if (this.config.enabled) {
      this.initializeSession();
      this.setupEventListeners();
    } else {
      // Ensure session is always initialized, even if tracking is disabled
      this.session = {
        id: this.generateSessionId(),
        startTime: Date.now(),
        lastActivity: Date.now(),
        pageViews: 0,
        interactions: 0,
        timeSpent: 0
      };
    }
  }

  private isTrackingAllowed(): boolean {
    // Respect Do Not Track header
    if (this.config.respectDoNotTrack && navigator.doNotTrack === '1') {
      return false;
    }

    // Check for consent (you might want to implement a consent banner)
    const consent = localStorage.getItem('analytics-consent');
    if (consent === 'denied') {
      return false;
    }

    return true;
  }

  private initializeSession(): void {
    const existingSessionId = sessionStorage.getItem('analytics-session-id');
    const sessionStartTime = sessionStorage.getItem('analytics-session-start');
    
    if (existingSessionId && sessionStartTime) {
      const startTime = parseInt(sessionStartTime, 10);
      const timeSinceStart = Date.now() - startTime;
      
      // Check if session is still valid
      if (timeSinceStart < this.config.sessionTimeout) {
        this.session = {
          id: existingSessionId,
          startTime: startTime,
          lastActivity: Date.now(),
          pageViews: parseInt(sessionStorage.getItem('analytics-page-views') || '1', 10),
          interactions: parseInt(sessionStorage.getItem('analytics-interactions') || '0', 10),
          timeSpent: timeSinceStart
        };
      } else {
        this.createNewSession();
      }
    } else {
      this.createNewSession();
    }

    // Update session storage
    this.updateSessionStorage();
  }

  private createNewSession(): void {
    this.session = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 1,
      interactions: 0,
      timeSpent: 0
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateSessionStorage(): void {
    sessionStorage.setItem('analytics-session-id', this.session.id);
    sessionStorage.setItem('analytics-session-start', this.session.startTime.toString());
    sessionStorage.setItem('analytics-page-views', this.session.pageViews.toString());
    sessionStorage.setItem('analytics-interactions', this.session.interactions.toString());
  }

  private setupEventListeners(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.trackEvent('navigation', 'page_focus');
      } else {
        this.trackEvent('navigation', 'page_blur');
        this.updateTimeSpent();
      }
    });

    // Track beforeunload for session cleanup
    window.addEventListener('beforeunload', () => {
      this.updateTimeSpent();
      this.sendPendingEvents();
    });

    // Update activity time on user interactions
    ['click', 'scroll', 'keydown', 'mousemove'].forEach(eventType => {
      document.addEventListener(eventType, this.updateActivity.bind(this), { passive: true });
    });
  }

  private updateActivity(): void {
    this.lastActivityTime = Date.now();
    this.session.lastActivity = this.lastActivityTime;
  }

  private updateTimeSpent(): void {
    this.session.timeSpent = Date.now() - this.session.startTime;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private trackEvent(
    category: AnalyticsEvent['category'],
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, any>
  ): void {
    if (!this.config.enabled) return;

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      name: `${category}_${action}`,
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.session.id,
      properties: {
        url: this.sanitizeUrl(window.location.href),
        referrer: this.sanitizeUrl(document.referrer),
        userAgent: this.sanitizeUserAgent(navigator.userAgent),
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        ...properties
      }
    };

    this.events.push(event);
    this.session.interactions++;

    // Keep only recent events
    if (this.events.length > this.config.maxEvents) {
      this.events.shift();
    }

    // Update session storage
    this.updateSessionStorage();

    // Debug logging
    if (this.config.debug) {
      console.log('📊 Analytics Event:', event);
    }

    // Store locally for debugging
    if (this.config.debug) {
      this.storeEventLocally(event);
    }

    // Send event (in a real implementation)
    this.sendEvent(event);
  }

  private sanitizeUrl(url: string): string {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      // Remove query parameters and hash that might contain sensitive data
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch {
      return 'invalid-url';
    }
  }

  private sanitizeUserAgent(userAgent: string): string {
    // Remove potentially sensitive information from user agent
    return userAgent.replace(/\([^)]*\)/g, '(...)');
  }

  private storeEventLocally(event: AnalyticsEvent): void {
    try {
      const stored = JSON.parse(localStorage.getItem('analytics-events') || '[]');
      stored.push(event);
      
      // Keep only last 100 events
      if (stored.length > 100) {
        stored.splice(0, stored.length - 100);
      }
      
      localStorage.setItem('analytics-events', JSON.stringify(stored));
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  private sendEvent(event: AnalyticsEvent): void {
    // In a real implementation, you would send this to your analytics service
    if (this.config.endpoint) {
      // Example of how you might send to an external service
      fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      }).catch(() => {
        // Silently fail - don't create errors for analytics
      });
    }
  }

  private sendPendingEvents(): void {
    // Send any pending events before page unload
    if (this.events.length > 0 && this.config.endpoint) {
      // Use sendBeacon for reliable delivery
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          this.config.endpoint,
          JSON.stringify({
            events: this.events,
            session: this.session
          })
        );
      }
    }
  }

  private ensureSessionInitialized(): void {
    if (!this.session) {
      this.initializeSession();
    }
  }

  // Public methods for tracking specific events
  public trackPageView(page: string, title?: string): void {
    this.ensureSessionInitialized();
    if (!this.config.enabled) return;

    this.session.pageViews++;
    this.trackEvent('navigation', 'page_view', page, undefined, {
      pageTitle: title || document.title,
      timestamp: Date.now()
    });
  }

  public trackSectionView(sectionId: string, sectionTitle: string): void {
    this.trackEvent('content', 'section_view', sectionId, undefined, {
      sectionTitle,
      timestamp: Date.now()
    });
  }

  public trackVisualizationInteraction(visualizationName: string, interactionType: string, details?: any): void {
    this.trackEvent('visualization', 'interaction', visualizationName, undefined, {
      interactionType,
      details,
      timestamp: Date.now()
    });
  }

  public trackVisualizationLoad(visualizationName: string, loadTime: number): void {
    this.trackEvent('visualization', 'load', visualizationName, loadTime, {
      loadTime,
      timestamp: Date.now()
    });
  }

  public trackUserInteraction(element: string, action: string, context?: any): void {
    this.trackEvent('interaction', action, element, undefined, {
      context,
      timestamp: Date.now()
    });
  }

  public trackPerformanceMetric(metricName: string, value: number, context?: any): void {
    this.trackEvent('performance', 'metric', metricName, value, {
      context,
      timestamp: Date.now()
    });
  }

  public trackError(errorType: string, errorMessage: string, severity: string): void {
    this.trackEvent('interaction', 'error', errorType, undefined, {
      errorMessage,
      severity,
      timestamp: Date.now()
    });
  }

  // Utility methods
  public getSession(): UserSession {
    this.updateTimeSpent();
    return { ...this.session };
  }

  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  public getStoredEvents(): AnalyticsEvent[] {
    if (typeof localStorage === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem('analytics-events') || '[]');
    } catch {
      return [];
    }
  }

  public clearData(): void {
    this.events = [];
    
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('analytics-events');
      localStorage.removeItem('analytics-consent');
    }
    
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('analytics-session-id');
      sessionStorage.removeItem('analytics-session-start');
      sessionStorage.removeItem('analytics-page-views');
      sessionStorage.removeItem('analytics-interactions');
    }
  }

  public setConsent(granted: boolean): void {
    localStorage.setItem('analytics-consent', granted ? 'granted' : 'denied');
    
    if (!granted) {
      this.config.enabled = false;
      this.clearData();
    } else if (this.isTrackingAllowed()) {
      this.config.enabled = true;
      this.initializeSession();
    }
  }

  public getAnalyticsStats(): {
    eventsCount: number;
    sessionDuration: number;
    pageViews: number;
    interactions: number;
    eventsByCategory: Record<string, number>;
  } {
    const eventsByCategory: Record<string, number> = {};
    
    this.events.forEach(event => {
      eventsByCategory[event.category] = (eventsByCategory[event.category] || 0) + 1;
    });

    return {
      eventsCount: this.events.length,
      sessionDuration: this.session.timeSpent,
      pageViews: this.session.pageViews,
      interactions: this.session.interactions,
      eventsByCategory
    };
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Export class for custom instances
export { Analytics };

// Export types
export type { AnalyticsEvent, UserSession, AnalyticsConfig };