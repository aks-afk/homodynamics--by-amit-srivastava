import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { respectsReducedMotion } from '../utils/visualizationAccessibility';

interface RefinedVisualizationPanelProps {
  title: string;
  description?: string;
  children: ReactNode;
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  onRetry?: () => void;
  loadingDelay?: number;
  fadeInDelay?: number;
}

const RefinedVisualizationPanel: React.FC<RefinedVisualizationPanelProps> = ({
  title,
  description,
  children,
  isLoading = false,
  hasError = false,
  errorMessage = 'Failed to load visualization',
  className = '',
  onRetry,
  loadingDelay = 300,
  fadeInDelay = 100
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for fade-in animation
  useEffect(() => {
    if (!panelRef.current || respectsReducedMotion()) {
      setIsVisible(true);
      setShowContent(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), fadeInDelay);
            setTimeout(() => setShowContent(true), fadeInDelay + 200);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observerRef.current.observe(panelRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [fadeInDelay]);

  // Loading state management
  useEffect(() => {
    if (isLoading) {
      setShowContent(false);
    } else {
      const timer = setTimeout(() => setShowContent(true), loadingDelay);
      return () => clearTimeout(timer);
    }
  }, [isLoading, loadingDelay]);

  const panelStyles: React.CSSProperties = {
    background: 'var(--color-surface, #ffffff)',
    border: '1px solid var(--color-border, #e9ecef)',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: respectsReducedMotion() 
      ? 'none' 
      : 'opacity 0.6s ease-out, transform 0.6s ease-out',
    position: 'relative',
    overflow: 'hidden'
  };

  const headerStyles: React.CSSProperties = {
    marginBottom: description ? '0.5rem' : '1rem'
  };

  const titleStyles: React.CSSProperties = {
    fontSize: 'var(--text-lg, 1.125rem)',
    fontWeight: 'var(--font-weight-medium, 500)',
    color: 'var(--color-text-primary, #1a1a1a)',
    margin: 0,
    fontFamily: 'var(--font-family-primary, Inter, sans-serif)'
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: 'var(--text-sm, 0.875rem)',
    color: 'var(--color-text-secondary, #4a4a4a)',
    lineHeight: 'var(--line-height-relaxed, 1.625)',
    margin: '0.5rem 0 1rem 0',
    fontFamily: 'var(--font-family-primary, Inter, sans-serif)'
  };

  const contentStyles: React.CSSProperties = {
    opacity: showContent ? 1 : 0,
    transition: respectsReducedMotion() 
      ? 'none' 
      : 'opacity 0.4s ease-in-out',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  // Skeleton loading component
  const SkeletonLoader = () => (
    <div 
      style={{
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem 0'
      }}
      aria-label="Loading visualization"
      role="status"
    >
      {/* Skeleton title */}
      <div
        style={{
          height: '20px',
          width: '60%',
          background: 'linear-gradient(90deg, var(--color-surface-subtle, #f8f9fa) 25%, var(--color-border-subtle, #f1f3f4) 50%, var(--color-surface-subtle, #f8f9fa) 75%)',
          backgroundSize: '200% 100%',
          animation: respectsReducedMotion() ? 'none' : 'shimmer 2s infinite',
          borderRadius: '4px'
        }}
      />
      
      {/* Skeleton visualization area */}
      <div
        style={{
          height: '150px',
          width: '100%',
          background: 'linear-gradient(90deg, var(--color-surface-subtle, #f8f9fa) 25%, var(--color-border-subtle, #f1f3f4) 50%, var(--color-surface-subtle, #f8f9fa) 75%)',
          backgroundSize: '200% 100%',
          animation: respectsReducedMotion() ? 'none' : 'shimmer 2s infinite',
          borderRadius: '4px'
        }}
      />
      
      {/* Skeleton description */}
      <div
        style={{
          height: '14px',
          width: '80%',
          background: 'linear-gradient(90deg, var(--color-surface-subtle, #f8f9fa) 25%, var(--color-border-subtle, #f1f3f4) 50%, var(--color-surface-subtle, #f8f9fa) 75%)',
          backgroundSize: '200% 100%',
          animation: respectsReducedMotion() ? 'none' : 'shimmer 2s infinite',
          borderRadius: '4px'
        }}
      />
      
      <span className="sr-only">Loading visualization content...</span>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div 
      className="visualization-error"
      role="alert"
      aria-live="polite"
    >
      <div className="visualization-error-title">
        Visualization Unavailable
      </div>
      <div className="visualization-error-message">
        {errorMessage}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: 'var(--color-accent, #2563eb)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: 'var(--text-sm, 0.875rem)',
            fontFamily: 'var(--font-family-primary, Inter, sans-serif)'
          }}
          aria-label="Retry loading visualization"
        >
          Try Again
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Add shimmer animation keyframes */}
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          .refined-visualization-panel:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
          }
          
          @media (prefers-reduced-motion: reduce) {
            .refined-visualization-panel:hover {
              transform: none;
            }
          }
        `}
      </style>
      
      <div
        ref={panelRef}
        className={`refined-visualization-panel ${className}`}
        style={panelStyles}
        role="region"
        aria-labelledby={`panel-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        aria-describedby={description ? `panel-desc-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined}
      >
        <header style={headerStyles}>
          <h3 
            id={`panel-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
            style={titleStyles}
          >
            {title}
          </h3>
          {description && (
            <p 
              id={`panel-desc-${title.replace(/\s+/g, '-').toLowerCase()}`}
              style={descriptionStyles}
            >
              {description}
            </p>
          )}
        </header>
        
        <div style={contentStyles}>
          {hasError ? (
            <ErrorState />
          ) : isLoading ? (
            <SkeletonLoader />
          ) : (
            <div role="img" aria-label={`${title} visualization`}>
              {children}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RefinedVisualizationPanel;