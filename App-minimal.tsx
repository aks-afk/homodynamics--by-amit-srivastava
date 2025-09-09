import React, { useState, useEffect } from 'react';
import { contentData } from './data-minimal';
import Hero from './components/Hero';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import ElegantProgressIndicator from './components/ElegantProgressIndicator';
import SectionPage from './components/SectionPage';

const App: React.FC = () => {
  const [currentSectionId, setCurrentSectionId] = useState<string>(contentData[0].id);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const section = contentData.find(s => s.id === hash);
      if (section) {
        setCurrentSectionId(section.id);
      } else {
        setCurrentSectionId(contentData[0].id);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSelectSection = (sectionId: string) => {
    window.location.hash = sectionId;
    setCurrentSectionId(sectionId);
  };

  const currentSection = contentData.find(section => section.id === currentSectionId) || contentData[0];
  const sectionIds = contentData.map(section => section.id);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
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

      <main style={{
        paddingTop: '70px',
        position: 'relative',
        zIndex: 1,
      }}>
        <Hero />
        <ErrorBoundary
          context="Main Content"
          enableRetry={true}
          showErrorDetails={process.env.NODE_ENV === 'development'}
        >
          <div style={{ padding: 'var(--space-8) var(--space-16)' }}>
            <SectionPage
              section={currentSection}
            />
            <footer style={{
              textAlign: 'center',
              padding: 'var(--space-8) 0 0 0',
              marginTop: 'var(--space-8)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
              borderTop: '1px solid var(--color-border)',
            }}>
              © 2024 Homodynamics. Created by Amit Srivastava. All rights reserved.
            </footer>
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default App;
