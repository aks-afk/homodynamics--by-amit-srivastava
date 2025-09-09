import React, { useState, useEffect } from 'react';

interface ElegantProgressIndicatorProps {
  /** Current section ID for section-based progress */
  currentSectionId?: string;
  /** Array of section IDs for calculating progress */
  sectionIds?: string[];
  /** Show reading progress based on scroll position */
  showScrollProgress?: boolean;
}

const ElegantProgressIndicator: React.FC<ElegantProgressIndicatorProps> = ({
  currentSectionId,
  sectionIds = [],
  showScrollProgress = true
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!showScrollProgress) return;

      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
      
      // Show indicator when user has scrolled past the hero section
      setIsVisible(scrollTop > 100);
    };

    if (showScrollProgress) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial calculation
    }

    return () => {
      if (showScrollProgress) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [showScrollProgress]);

  useEffect(() => {
    if (currentSectionId && sectionIds.length > 0) {
      const currentIndex = sectionIds.indexOf(currentSectionId);
      const progress = currentIndex >= 0 ? ((currentIndex + 1) / sectionIds.length) * 100 : 0;
      setSectionProgress(progress);
    }
  }, [currentSectionId, sectionIds]);

  const progressBarStyle: React.CSSProperties = {
    position: 'fixed',
    top: '70px', // Below the header
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: 'var(--color-border-subtle)',
    zIndex: 800,
    opacity: isVisible ? 1 : 0,
    transition: 'opacity var(--transition-normal)',
    pointerEvents: 'none',
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: 'var(--color-accent)',
    width: `${showScrollProgress ? scrollProgress : sectionProgress}%`,
    transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    borderRadius: '0 2px 2px 0',
    boxShadow: '0 0 8px rgba(37, 99, 235, 0.3)',
  };

  const sectionIndicatorStyle: React.CSSProperties = {
    position: 'fixed',
    top: '80px',
    right: 'var(--space-6)',
    zIndex: 800,
    opacity: isVisible && sectionIds.length > 0 ? 1 : 0,
    transition: 'opacity var(--transition-normal)',
    pointerEvents: 'none',
  };

  const sectionCountStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--font-family-primary)',
    fontWeight: 'var(--font-weight-medium)',
    letterSpacing: 'var(--letter-spacing-wide)',
    textTransform: 'uppercase',
    backgroundColor: 'var(--color-surface)',
    padding: 'var(--space-1) var(--space-2)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  };

  if (!showScrollProgress && sectionIds.length === 0) {
    return null;
  }

  const currentSectionIndex = currentSectionId ? sectionIds.indexOf(currentSectionId) : -1;
  const totalSections = sectionIds.length;

  return (
    <>
      {/* Main progress bar */}
      <div style={progressBarStyle}>
        <div style={progressFillStyle} />
      </div>

      {/* Section indicator */}
      {sectionIds.length > 0 && (
        <div style={sectionIndicatorStyle}>
          <div style={sectionCountStyle}>
            {currentSectionIndex >= 0 ? currentSectionIndex + 1 : 1} / {totalSections}
          </div>
        </div>
      )}
    </>
  );
};

export default ElegantProgressIndicator;