/**
 * Responsive Design Testing Utilities
 * Provides tools for testing responsive behavior and device compatibility
 */

export interface ViewportSize {
  width: number;
  height: number;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  size: 'small' | 'medium' | 'large';
  orientation: 'portrait' | 'landscape';
  touchCapable: boolean;
}

export interface ResponsiveTestResult {
  viewport: ViewportSize;
  device: DeviceInfo;
  issues: string[];
  recommendations: string[];
  score: number;
}

/**
 * Get current viewport dimensions
 */
export function getViewportSize(): ViewportSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

/**
 * Detect device type and capabilities
 */
export function getDeviceInfo(): DeviceInfo {
  const viewport = getViewportSize();
  const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  let type: DeviceInfo['type'];
  let size: DeviceInfo['size'];
  
  if (viewport.width <= 768) {
    type = 'mobile';
    size = viewport.width <= 480 ? 'small' : 'medium';
  } else if (viewport.width <= 1024) {
    type = 'tablet';
    size = 'medium';
  } else {
    type = 'desktop';
    size = viewport.width <= 1440 ? 'medium' : 'large';
  }
  
  const orientation = viewport.width > viewport.height ? 'landscape' : 'portrait';
  
  return {
    type,
    size,
    orientation,
    touchCapable
  };
}

/**
 * Test if touch targets meet accessibility guidelines
 */
export function testTouchTargets(): { passed: boolean; issues: string[] } {
  const issues: string[] = [];
  const minTouchTargetSize = 44; // pixels
  
  // Test buttons
  const buttons = document.querySelectorAll('button, [role="button"]');
  buttons.forEach((button, index) => {
    const rect = button.getBoundingClientRect();
    if (rect.width < minTouchTargetSize || rect.height < minTouchTargetSize) {
      issues.push(`Button ${index + 1} is too small: ${rect.width}x${rect.height}px (minimum: ${minTouchTargetSize}x${minTouchTargetSize}px)`);
    }
  });
  
  // Test links (excluding inline links)
  const links = document.querySelectorAll('a:not(p a):not(li a):not(span a)');
  links.forEach((link, index) => {
    const rect = link.getBoundingClientRect();
    if (rect.width < minTouchTargetSize || rect.height < minTouchTargetSize) {
      issues.push(`Link ${index + 1} is too small: ${rect.width}x${rect.height}px (minimum: ${minTouchTargetSize}x${minTouchTargetSize}px)`);
    }
  });
  
  return {
    passed: issues.length === 0,
    issues
  };
}

/**
 * Test for horizontal scrolling issues
 */
export function testHorizontalScrolling(): { passed: boolean; issues: string[] } {
  const issues: string[] = [];
  const bodyWidth = document.body.scrollWidth;
  const viewportWidth = window.innerWidth;
  
  if (bodyWidth > viewportWidth) {
    issues.push(`Horizontal scrolling detected: body width (${bodyWidth}px) exceeds viewport width (${viewportWidth}px)`);
  }
  
  // Check for elements that extend beyond viewport
  const allElements = document.querySelectorAll('*');
  allElements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    if (rect.right > viewportWidth) {
      const tagName = element.tagName.toLowerCase();
      const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
      issues.push(`Element extends beyond viewport: ${tagName}${className} (right: ${rect.right}px, viewport: ${viewportWidth}px)`);
    }
  });
  
  return {
    passed: issues.length === 0,
    issues: issues.slice(0, 10) // Limit to first 10 issues to avoid spam
  };
}

/**
 * Test text readability
 */
export function testTextReadability(): { passed: boolean; issues: string[] } {
  const issues: string[] = [];
  const minFontSize = 16; // pixels for mobile
  const device = getDeviceInfo();
  
  if (device.type === 'mobile') {
    const textElements = document.querySelectorAll('p, span, div, li, td, th');
    textElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const fontSize = parseFloat(computedStyle.fontSize);
      
      if (fontSize < minFontSize && element.textContent?.trim()) {
        const tagName = element.tagName.toLowerCase();
        issues.push(`Text too small on mobile: ${tagName} has ${fontSize}px font size (minimum: ${minFontSize}px)`);
      }
    });
  }
  
  return {
    passed: issues.length === 0,
    issues: issues.slice(0, 10) // Limit to first 10 issues
  };
}

/**
 * Test navigation functionality
 */
export function testNavigation(): { passed: boolean; issues: string[] } {
  const issues: string[] = [];
  const device = getDeviceInfo();
  
  if (device.type === 'mobile') {
    // Test mobile navigation
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    
    if (!mobileMenuButton) {
      issues.push('Mobile menu button not found');
    }
    
    if (!mobileNav) {
      issues.push('Mobile navigation overlay not found');
    }
    
    // Test if desktop navigation is hidden on mobile
    const desktopNav = document.querySelector('.desktop-nav');
    if (desktopNav) {
      const computedStyle = window.getComputedStyle(desktopNav);
      if (computedStyle.display !== 'none') {
        issues.push('Desktop navigation should be hidden on mobile');
      }
    }
  } else {
    // Test desktop navigation
    const desktopNav = document.querySelector('.desktop-nav');
    if (!desktopNav) {
      issues.push('Desktop navigation not found');
    }
    
    // Test if mobile navigation is hidden on desktop
    const mobileMenuButton = document.querySelector('.mobile-menu-button-container');
    if (mobileMenuButton) {
      const computedStyle = window.getComputedStyle(mobileMenuButton);
      if (computedStyle.display !== 'none') {
        issues.push('Mobile menu button should be hidden on desktop');
      }
    }
  }
  
  return {
    passed: issues.length === 0,
    issues
  };
}

/**
 * Test visualization responsiveness
 */
export function testVisualizationResponsiveness(): { passed: boolean; issues: string[] } {
  const issues: string[] = [];
  
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach((svg, index) => {
    const computedStyle = window.getComputedStyle(svg);
    
    // Check if SVG is responsive
    if (computedStyle.width !== '100%' && !svg.hasAttribute('viewBox')) {
      issues.push(`SVG ${index + 1} may not be responsive: missing viewBox and width is not 100%`);
    }
    
    // Check if SVG has proper ARIA attributes
    if (!svg.hasAttribute('role') && !svg.hasAttribute('aria-label')) {
      issues.push(`SVG ${index + 1} missing accessibility attributes (role or aria-label)`);
    }
  });
  
  return {
    passed: issues.length === 0,
    issues
  };
}

/**
 * Test performance on current device
 */
export function testPerformance(): Promise<{ passed: boolean; issues: string[]; metrics: any }> {
  return new Promise((resolve) => {
    const issues: string[] = [];
    const metrics: any = {};
    
    // Test Core Web Vitals if available
    if ('web-vital' in window) {
      // This would integrate with actual Core Web Vitals measurement
      metrics.coreWebVitals = 'Available';
    }
    
    // Test loading performance
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    metrics.loadTime = loadTime;
    
    if (loadTime > 3000) {
      issues.push(`Page load time too slow: ${loadTime}ms (target: <3000ms)`);
    }
    
    // Test memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metrics.memoryUsage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
      
      const memoryUsagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      if (memoryUsagePercent > 80) {
        issues.push(`High memory usage: ${memoryUsagePercent.toFixed(1)}%`);
      }
    }
    
    resolve({
      passed: issues.length === 0,
      issues,
      metrics
    });
  });
}

/**
 * Run comprehensive responsive design tests
 */
export async function runResponsiveTests(): Promise<ResponsiveTestResult> {
  const viewport = getViewportSize();
  const device = getDeviceInfo();
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Run all tests
  const touchTargetTest = testTouchTargets();
  const horizontalScrollTest = testHorizontalScrolling();
  const textReadabilityTest = testTextReadability();
  const navigationTest = testNavigation();
  const visualizationTest = testVisualizationResponsiveness();
  const performanceTest = await testPerformance();
  
  // Collect issues
  issues.push(...touchTargetTest.issues);
  issues.push(...horizontalScrollTest.issues);
  issues.push(...textReadabilityTest.issues);
  issues.push(...navigationTest.issues);
  issues.push(...visualizationTest.issues);
  issues.push(...performanceTest.issues);
  
  // Generate recommendations based on device type
  if (device.type === 'mobile') {
    recommendations.push('Ensure all interactive elements are touch-friendly');
    recommendations.push('Optimize images for mobile bandwidth');
    recommendations.push('Consider implementing swipe gestures for navigation');
  } else if (device.type === 'tablet') {
    recommendations.push('Support both touch and mouse interactions');
    recommendations.push('Optimize layout for both portrait and landscape orientations');
  } else {
    recommendations.push('Implement keyboard navigation for all interactive elements');
    recommendations.push('Consider hover states for better user feedback');
    recommendations.push('Optimize for larger screen real estate');
  }
  
  // Calculate score (0-100)
  const totalTests = 6;
  const passedTests = [
    touchTargetTest.passed,
    horizontalScrollTest.passed,
    textReadabilityTest.passed,
    navigationTest.passed,
    visualizationTest.passed,
    performanceTest.passed
  ].filter(Boolean).length;
  
  const score = Math.round((passedTests / totalTests) * 100);
  
  return {
    viewport,
    device,
    issues,
    recommendations,
    score
  };
}

/**
 * Generate responsive testing report
 */
export function generateTestingReport(result: ResponsiveTestResult): string {
  const { viewport, device, issues, recommendations, score } = result;
  
  let report = `# Responsive Design Testing Report\n\n`;
  report += `**Generated:** ${new Date().toLocaleString()}\n`;
  report += `**Viewport:** ${viewport.width}x${viewport.height}px\n`;
  report += `**Device Type:** ${device.type} (${device.size})\n`;
  report += `**Orientation:** ${device.orientation}\n`;
  report += `**Touch Capable:** ${device.touchCapable ? 'Yes' : 'No'}\n`;
  report += `**Overall Score:** ${score}/100\n\n`;
  
  if (issues.length > 0) {
    report += `## Issues Found (${issues.length})\n\n`;
    issues.forEach((issue, index) => {
      report += `${index + 1}. ${issue}\n`;
    });
    report += `\n`;
  } else {
    report += `## ✅ No Issues Found\n\n`;
  }
  
  if (recommendations.length > 0) {
    report += `## Recommendations\n\n`;
    recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
    report += `\n`;
  }
  
  return report;
}

/**
 * Monitor viewport changes and run tests automatically
 */
export function setupResponsiveMonitoring(callback?: (result: ResponsiveTestResult) => void): () => void {
  let timeoutId: number;
  
  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(async () => {
      const result = await runResponsiveTests();
      if (callback) {
        callback(result);
      } else {
        console.log('Responsive Test Result:', result);
      }
    }, 500); // Debounce resize events
  };
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
    clearTimeout(timeoutId);
  };
}

/**
 * Test specific breakpoints
 */
export function testBreakpoints(): { [breakpoint: string]: ResponsiveTestResult } {
  const breakpoints = {
    'mobile-small': { width: 320, height: 568 },
    'mobile-large': { width: 414, height: 896 },
    'tablet-portrait': { width: 768, height: 1024 },
    'tablet-landscape': { width: 1024, height: 768 },
    'desktop-small': { width: 1280, height: 720 },
    'desktop-large': { width: 1920, height: 1080 }
  };
  
  const results: { [breakpoint: string]: ResponsiveTestResult } = {};
  
  // Note: This would require actual viewport manipulation in a real testing environment
  // For now, we'll return the current viewport test result for all breakpoints
  Object.keys(breakpoints).forEach(async (breakpoint) => {
    results[breakpoint] = await runResponsiveTests();
  });
  
  return results;
}