import React, { useState, useEffect } from 'react';
import SectionPage from './components/SectionPage';
import { contentData } from './data';
import Hero from './components/Hero';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import ElegantProgressIndicator from './components/ElegantProgressIndicator';
import SophisticatedNavigation from './components/SophisticatedNavigation';
import { useScrollSpy } from './hooks/useScrollSpy';
import { preloadHighPriorityVisualizations } from './utils/visualizationRegistry';
import { initPerformanceMonitoring } from './utils/performanceMonitor';
import { initGlobalErrorHandling } from './utils/globalErrorHandler';
// import ResponsiveTestingPanel from './src/components/ResponsiveTestingPanel'; // Temporarily commented out
import { webVitalsTracker } from './utils/webVitals';
import { errorMonitor } from './utils/errorMonitoring';
import { analytics } from './utils/analytics';
import MonitoringDashboard from './components/MonitoringDashboard';

const App: React.FC = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>(contentData[0].id);
  const [currentSubSectionId, setCurrentSubSectionId] = useState<string>('');
  const [showMonitoringDashboard, setShowMonitoringDashboard] = useState<boolean>(false);
  
  useEffect(() => {
    // Initialize error handling and performance monitoring
    initGlobalErrorHandling();
    initPerformanceMonitoring();

    // Initialize new monitoring utilities
    webVitalsTracker; // Initialize singleton
    errorMonitor; // Initialize singleton
    analytics.trackPageView('app', 'Homodynamics Application');

    // Preload high-priority visualizations in the background
    const preloadVisualizations = async () => {
      try {
        await preloadHighPriorityVisualizations();
        console.log('High-priority visualizations preloaded');
      } catch (error) {
        console.warn('Failed to preload some visualizations:', error);
        errorMonitor.reportError(error as Error, { context: 'visualization_preload' }, 'medium');
      }
    };

    // Start preloading after a short delay to not block initial render
    const timeoutId = setTimeout(preloadVisualizations, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const section = contentData.find(s => s.id === hash);
      if (section) {
        if (currentSectionId !== section.id) {
          window.scrollTo(0, 0);
        }
        setCurrentSectionId(section.id);
      } else {
        const firstSectionId = contentData[0].id;
        setCurrentSectionId(firstSectionId);
        window.location.hash = firstSectionId;
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentSectionId]);

  const handleSelectSection = (sectionId: string, elementId?: string) => {
    // Track navigation analytics
    analytics.trackSectionView(sectionId, contentData.find(s => s.id === sectionId)?.title || sectionId);
    analytics.trackUserInteraction('navigation', 'section_select', { sectionId, elementId });

    const performScroll = () => {
        if (elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                const headerOffset = 90; // 70px header + 20px space
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (sectionId !== currentSectionId) {
      window.location.hash = sectionId;
      setCurrentSubSectionId(elementId || '');
      // The hash change triggers a re-render. We need to wait for it before scrolling.
      setTimeout(performScroll, 100); 
    } else {
      setCurrentSubSectionId(elementId || '');
      performScroll();
    }
  };

  const currentSection = contentData.find(section => section.id === currentSectionId) || contentData[0];
  
  // Extract section IDs for progress tracking
  const sectionIds = contentData.map(section => section.id);

  // Enhanced scroll spying for main sections
  const { activeId: activeMainSectionId } = useScrollSpy(sectionIds, {
    rootMargin: '-70px 0px -80% 0px',
    threshold: [0, 0.25, 0.5],
    debounceMs: 200
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        onFocus={(e) => {
          (e.target as HTMLElement).style.position = 'static';
          (e.target as HTMLElement).style.left = 'auto';
          (e.target as HTMLElement).style.width = 'auto';
          (e.target as HTMLElement).style.height = 'auto';
          (e.target as HTMLElement).style.overflow = 'visible';
          (e.target as HTMLElement).style.padding = 'var(--space-2) var(--space-4)';
          (e.target as HTMLElement).style.backgroundColor = 'var(--color-accent)';
          (e.target as HTMLElement).style.color = 'white';
          (e.target as HTMLElement).style.textDecoration = 'none';
          (e.target as HTMLElement).style.zIndex = '9999';
        }}
        onBlur={(e) => {
          (e.target as HTMLElement).style.position = 'absolute';
          (e.target as HTMLElement).style.left = '-10000px';
          (e.target as HTMLElement).style.width = '1px';
          (e.target as HTMLElement).style.height = '1px';
          (e.target as HTMLElement).style.overflow = 'hidden';
          (e.target as HTMLElement).style.padding = '0';
        }}
      >
        Skip to main content
      </a>

      <Header
        sections={contentData}
        currentSectionId={currentSectionId}
        onSelectSection={handleSelectSection}
      />
      
      <ElegantProgressIndicator
        currentSectionId={currentSectionId}
        sectionIds={sectionIds}
        showScrollProgress={true}
      />
      
      <SophisticatedNavigation
        sections={contentData}
        currentSectionId={currentSectionId}
        currentSubSectionId={currentSubSectionId}
        onSelectSection={handleSelectSection}
      />
      
      <main 
        id="main-content"
        className="main-content" 
        style={{ 
            paddingTop: '70px',
            position: 'relative', // Create a stacking context
            zIndex: 1,            // Ensure it's below the header (z-index: 900)
        }}
        role="main"
        aria-label="Main content"
      >
        <Hero />
        <ErrorBoundary 
          context="Main Content"
          enableRetry={true}
          showErrorDetails={process.env.NODE_ENV === 'development'}
        >
          <div className="content-wrapper" style={{ padding: 'var(--space-8) var(--space-16)' }}>
            <SectionPage 
              section={currentSection} 
            />
            <footer 
              style={{
                textAlign: 'center',
                padding: 'var(--space-8) 0 0 0',
                marginTop: 'var(--space-8)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
                borderTop: '1px solid var(--color-border)',
              }}
              role="contentinfo"
              aria-label="Site footer"
            >
              © 2024 Homodynamics. Created by Amit Srivastava. All rights reserved.
            </footer>
          </div>
        </ErrorBoundary>
      </main>
      
      {/* Responsive Testing Panel (development only) */}
      {/* <ResponsiveTestingPanel /> */}
      
      {/* Monitoring Dashboard (debug mode only) */}
      {(import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true' || import.meta.env.DEV) && (
        <MonitoringDashboard
          isVisible={showMonitoringDashboard}
          onToggle={() => setShowMonitoringDashboard(!showMonitoringDashboard)}
        />
      )}
    </div>
  );
};

export default App;