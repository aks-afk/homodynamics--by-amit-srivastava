// Utilities for graceful degradation when features fail

export interface FallbackContent {
  title: string;
  description: string;
  textContent?: string;
  imageUrl?: string;
  actionText?: string;
  actionUrl?: string;
}

export interface FeatureSupport {
  webgl: boolean;
  canvas: boolean;
  svg: boolean;
  intersectionObserver: boolean;
  performanceObserver: boolean;
  networkInformation: boolean;
}

class GracefulDegradation {
  private static instance: GracefulDegradation;
  private featureSupport: FeatureSupport;
  private fallbackRegistry: Map<string, FallbackContent> = new Map();

  static getInstance(): GracefulDegradation {
    if (!GracefulDegradation.instance) {
      GracefulDegradation.instance = new GracefulDegradation();
    }
    return GracefulDegradation.instance;
  }

  constructor() {
    this.featureSupport = this.detectFeatureSupport();
    this.setupFallbackContent();
  }

  private detectFeatureSupport(): FeatureSupport {
    return {
      webgl: this.supportsWebGL(),
      canvas: this.supportsCanvas(),
      svg: this.supportsSVG(),
      intersectionObserver: 'IntersectionObserver' in window,
      performanceObserver: 'PerformanceObserver' in window,
      networkInformation: 'connection' in navigator,
    };
  }

  private supportsWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  private supportsCanvas(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    } catch (e) {
      return false;
    }
  }

  private supportsSVG(): boolean {
    return !!(
      document.createElementNS &&
      document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
    );
  }

  private setupFallbackContent(): void {
    // Register fallback content for common visualizations
    this.registerFallback('DynamicEquilibriumViz', {
      title: 'Dynamic Equilibrium',
      description: 'Life as a continuous process of maintaining stability through constant adaptation and change.',
      textContent: 'Dynamic equilibrium represents the fundamental principle that living systems maintain their structure and function not through static stability, but through continuous adaptation to changing conditions. Like a dancer maintaining balance through constant micro-adjustments, life persists through dynamic responsiveness rather than rigid resistance to change.',
    });

    this.registerFallback('PlatosCaveViz', {
      title: "Plato's Allegory of the Cave",
      description: 'A metaphor for the journey from ignorance to knowledge and the nature of reality.',
      textContent: 'In Plato\'s famous allegory, prisoners chained in a cave mistake shadows on the wall for reality itself. Only when freed and exposed to the true world outside do they understand the limitations of their previous perception. This powerful metaphor illustrates how our understanding of reality is often limited by our perspective and experience.',
    });

    this.registerFallback('FourNobleTruthsViz', {
      title: 'The Four Noble Truths',
      description: 'The foundational teaching of Buddhism about the nature of suffering and the path to liberation.',
      textContent: 'The Four Noble Truths form the foundation of Buddhist teaching: (1) Life contains suffering (Dukkha), (2) Suffering arises from attachment and craving (Samudaya), (3) Suffering can be overcome (Nirodha), and (4) There is a path to end suffering (Magga). These truths provide a framework for understanding human experience and the possibility of liberation.',
    });

    // Add more fallback content as needed...
  }

  public registerFallback(componentName: string, content: FallbackContent): void {
    this.fallbackRegistry.set(componentName, content);
  }

  public getFallbackContent(componentName: string): FallbackContent | null {
    return this.fallbackRegistry.get(componentName) || null;
  }

  public getFeatureSupport(): FeatureSupport {
    return { ...this.featureSupport };
  }

  public shouldUseVisualization(componentName: string): boolean {
    // Check if the device/browser supports the required features
    const fallback = this.getFallbackContent(componentName);
    if (!fallback) return true; // No fallback available, try visualization

    // Basic feature requirements for most visualizations
    if (!this.featureSupport.svg && !this.featureSupport.canvas) {
      return false;
    }

    // Check for specific visualization requirements
    if (componentName.includes('3D') && !this.featureSupport.webgl) {
      return false;
    }

    // Check device capabilities
    if (this.isLowEndDevice()) {
      return false;
    }

    // Check network conditions
    if (this.isSlowNetwork()) {
      return false;
    }

    return true;
  }

  private isLowEndDevice(): boolean {
    // Detect low-end devices based on available information
    if ('hardwareConcurrency' in navigator) {
      return navigator.hardwareConcurrency <= 2;
    }

    if ('deviceMemory' in navigator) {
      return (navigator as any).deviceMemory <= 2;
    }

    // Fallback: check user agent for known low-end devices
    const userAgent = navigator.userAgent.toLowerCase();
    const lowEndIndicators = ['android 4', 'android 5', 'iphone 5', 'iphone 6'];
    return lowEndIndicators.some(indicator => userAgent.includes(indicator));
  }

  private isSlowNetwork(): boolean {
    if (!this.featureSupport.networkInformation) {
      return false;
    }

    const connection = (navigator as any).connection;
    if (!connection) return false;

    // Consider 2G or slow 3G as slow network
    return connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g';
  }

  public createFallbackElement(componentName: string): HTMLElement | null {
    const content = this.getFallbackContent(componentName);
    if (!content) return null;

    const container = document.createElement('div');
    container.style.cssText = `
      padding: var(--space-6);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      text-align: center;
    `;

    container.innerHTML = `
      <div style="margin-bottom: var(--space-4);">
        <h3 style="
          font-size: var(--text-xl);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin-bottom: var(--space-2);
        ">${content.title}</h3>
        <p style="
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
          margin-bottom: var(--space-4);
        ">${content.description}</p>
      </div>
      ${content.textContent ? `
        <div style="
          text-align: left;
          line-height: var(--line-height-relaxed);
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
          margin-bottom: var(--space-4);
        ">${content.textContent}</div>
      ` : ''}
      ${content.actionText && content.actionUrl ? `
        <a href="${content.actionUrl}" style="
          display: inline-block;
          background: var(--color-accent);
          color: white;
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-sm);
          text-decoration: none;
          font-size: var(--text-sm);
          font-weight: var(--font-weight-medium);
        ">${content.actionText}</a>
      ` : ''}
    `;

    return container;
  }

  public getRecommendations(): string[] {
    const recommendations: string[] = [];

    if (!this.featureSupport.svg && !this.featureSupport.canvas) {
      recommendations.push('Your browser may not support interactive visualizations. Consider updating to a modern browser.');
    }

    if (this.isLowEndDevice()) {
      recommendations.push('For better performance, consider using a device with more processing power.');
    }

    if (this.isSlowNetwork()) {
      recommendations.push('Slow network detected. Some interactive features may be disabled to improve loading times.');
    }

    if (!this.featureSupport.intersectionObserver) {
      recommendations.push('Some scroll-based animations may not work in your browser.');
    }

    return recommendations;
  }
}

// Export singleton instance
export const gracefulDegradation = GracefulDegradation.getInstance();