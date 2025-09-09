import React, { useState, useEffect, useRef } from 'react';
import { Section, SubSection, SubSubSection } from '../types';
import { useScrollSpy } from '../hooks/useScrollSpy';

interface SophisticatedNavigationProps {
  sections: Section[];
  currentSectionId: string;
  currentSubSectionId?: string;
  onSelectSection: (sectionId: string, elementId?: string) => void;
}

interface BreadcrumbItem {
  id: string;
  title: string;
  type: 'section' | 'subsection' | 'subsubsection';
}

interface TOCItem {
  id: string;
  title: string;
  level: number;
  type: 'section' | 'subsection' | 'subsubsection';
  isActive: boolean;
}

const SophisticatedNavigation: React.FC<SophisticatedNavigationProps> = ({
  sections,
  currentSectionId,
  currentSubSectionId,
  onSelectSection
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);

  // Generate element IDs for scroll spying
  const generateElementIds = (): string[] => {
    const currentSection = sections.find(s => s.id === currentSectionId);
    if (!currentSection || currentSection.type === 'header') return [];

    const ids: string[] = [];
    
    // Add subsection IDs
    currentSection.subSections.forEach(subSection => {
      if (subSection.title) {
        ids.push(subSection.id);
      }
      
      // Add sub-subsection IDs
      if (subSection.subSections) {
        subSection.subSections.forEach(subSubSection => {
          ids.push(subSubSection.id);
        });
      }
    });

    return ids;
  };

  const elementIds = generateElementIds();
  const { activeId, scrollToElement, isElementVisible, getIntersectionRatio } = useScrollSpy(elementIds, {
    rootMargin: '-90px 0px -50% 0px',
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    debounceMs: 150
  });

  // Generate breadcrumb trail
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    
    const currentSection = sections.find(s => s.id === currentSectionId);
    if (!currentSection) return breadcrumbs;

    // Add current section
    breadcrumbs.push({
      id: currentSection.id,
      title: currentSection.shortTitle,
      type: 'section'
    });

    // Add current subsection if exists
    if (currentSubSectionId) {
      const currentSubSection = currentSection.subSections.find(ss => ss.id === currentSubSectionId);
      if (currentSubSection) {
        breadcrumbs.push({
          id: currentSubSection.id,
          title: currentSubSection.title,
          type: 'subsection'
        });
      }
    }

    return breadcrumbs;
  };

  // Generate table of contents for current section
  const generateTOC = (): TOCItem[] => {
    const toc: TOCItem[] = [];
    const currentSection = sections.find(s => s.id === currentSectionId);
    
    if (!currentSection || currentSection.type === 'header') return toc;

    // Add main section
    toc.push({
      id: currentSection.id,
      title: currentSection.title,
      level: 1,
      type: 'section',
      isActive: !activeId || activeId === currentSection.id
    });

    // Add subsections
    currentSection.subSections.forEach(subSection => {
      if (subSection.title) {
        toc.push({
          id: subSection.id,
          title: subSection.title,
          level: 2,
          type: 'subsection',
          isActive: activeId === subSection.id
        });
      }

      // Add sub-subsections if they exist
      if (subSection.subSections) {
        subSection.subSections.forEach(subSubSection => {
          toc.push({
            id: subSubSection.id,
            title: subSubSection.title,
            level: 3,
            type: 'subsubsection',
            isActive: activeId === subSubSection.id
          });
        });
      }
    });

    return toc;
  };

  // Handle navigation click
  const handleNavigationClick = (item: TOCItem) => {
    if (item.type === 'section') {
      onSelectSection(item.id);
    } else {
      onSelectSection(currentSectionId, item.id);
      setTimeout(() => scrollToElement(item.id, 90), 100);
    }
  };

  const breadcrumbs = generateBreadcrumbs();
  const tocItems = generateTOC();

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '70px',
    right: '0',
    width: isExpanded ? '320px' : '48px',
    height: 'calc(100vh - 70px)',
    backgroundColor: 'var(--color-surface)',
    borderLeft: '1px solid var(--color-border)',
    transition: 'width var(--transition-normal)',
    zIndex: 800,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: isExpanded ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
  };

  const toggleButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'var(--space-4)',
    left: isExpanded ? 'var(--space-4)' : '50%',
    transform: isExpanded ? 'none' : 'translateX(-50%)',
    width: '32px',
    height: '32px',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    zIndex: 1,
  };

  const contentStyle: React.CSSProperties = {
    padding: isExpanded ? 'var(--space-16) var(--space-4) var(--space-4)' : '0',
    opacity: isExpanded ? 1 : 0,
    transition: 'opacity var(--transition-normal)',
    overflow: 'auto',
    flex: 1,
  };

  const breadcrumbStyle: React.CSSProperties = {
    marginBottom: 'var(--space-6)',
    paddingBottom: 'var(--space-4)',
    borderBottom: '1px solid var(--color-border-subtle)',
  };

  const breadcrumbItemStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-tertiary)',
    textDecoration: 'none',
    transition: 'color var(--transition-fast)',
  };

  const breadcrumbActiveStyle: React.CSSProperties = {
    ...breadcrumbItemStyle,
    color: 'var(--color-text-primary)',
    fontWeight: 'var(--font-weight-medium)',
  };

  const tocHeaderStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-3)',
    textTransform: 'uppercase',
    letterSpacing: 'var(--letter-spacing-wide)',
  };

  const tocItemStyle: React.CSSProperties = {
    display: 'block',
    padding: 'var(--space-2) var(--space-3)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
    lineHeight: 'var(--line-height-snug)',
    marginBottom: 'var(--space-1)',
  };

  const tocActiveItemStyle: React.CSSProperties = {
    ...tocItemStyle,
    backgroundColor: 'var(--color-accent-subtle)',
    color: 'var(--color-accent)',
    fontWeight: 'var(--font-weight-medium)',
    borderLeft: '3px solid var(--color-accent)',
    paddingLeft: '9px', // Adjust for border
  };

  const tocVisibleItemStyle: React.CSSProperties = {
    ...tocItemStyle,
    backgroundColor: 'var(--color-surface-subtle)',
    color: 'var(--color-text-primary)',
    borderLeft: '2px solid var(--color-border)',
    paddingLeft: '10px', // Adjust for border
  };

  return (
    <>
      <div style={containerStyle} className="sophisticated-navigation">
        <button
          style={toggleButtonStyle}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse navigation panel' : 'Expand navigation panel'}
          aria-expanded={isExpanded}
          aria-controls="navigation-content"
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface-subtle)';
            (e.target as HTMLElement).style.color = 'var(--color-text-primary)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface)';
            (e.target as HTMLElement).style.color = 'var(--color-text-secondary)';
          }}
        >
          {isExpanded ? '✕' : '☰'}
        </button>

        <div style={contentStyle} id="navigation-content">
          {/* Breadcrumb Navigation */}
          {breadcrumbs.length > 0 && (
            <nav style={breadcrumbStyle} aria-label="Breadcrumb navigation">
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                Current Path
              </div>
              {breadcrumbs.map((item, index) => (
                <div key={item.id} style={{ marginBottom: 'var(--space-1)' }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.type === 'section') {
                        onSelectSection(item.id);
                      } else {
                        onSelectSection(currentSectionId, item.id);
                      }
                    }}
                    style={index === breadcrumbs.length - 1 ? breadcrumbActiveStyle : breadcrumbItemStyle}
                    onMouseEnter={(e) => {
                      if (index !== breadcrumbs.length - 1) {
                        (e.target as HTMLElement).style.color = 'var(--color-text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (index !== breadcrumbs.length - 1) {
                        (e.target as HTMLElement).style.color = 'var(--color-text-tertiary)';
                      }
                    }}
                  >
                    {item.title}
                  </a>
                  {index < breadcrumbs.length - 1 && (
                    <span style={{ color: 'var(--color-text-muted)', margin: '0 var(--space-2)' }}>→</span>
                  )}
                </div>
              ))}
            </nav>
          )}

          {/* Table of Contents */}
          {tocItems.length > 0 && (
            <nav ref={tocRef} aria-label="Table of contents">
              <div style={tocHeaderStyle}>Contents</div>
              <div>
                {tocItems.map((item) => {
                  const isVisible = isElementVisible(item.id);
                  const intersectionRatio = getIntersectionRatio(item.id);
                  
                  let itemStyle = tocItemStyle;
                  if (item.isActive) {
                    itemStyle = tocActiveItemStyle;
                  } else if (isVisible) {
                    itemStyle = tocVisibleItemStyle;
                  }

                  return (
                    <div key={item.id} style={{ position: 'relative' }}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigationClick(item);
                        }}
                        style={{
                          ...itemStyle,
                          paddingLeft: `${12 + (item.level - 1) * 16}px`, // 12px = var(--space-3)
                          transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                          if (!item.isActive) {
                            (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface-subtle)';
                            (e.target as HTMLElement).style.color = 'var(--color-text-primary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!item.isActive && !isVisible) {
                            (e.target as HTMLElement).style.backgroundColor = 'transparent';
                            (e.target as HTMLElement).style.color = 'var(--color-text-secondary)';
                          } else if (!item.isActive && isVisible) {
                            (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface-subtle)';
                            (e.target as HTMLElement).style.color = 'var(--color-text-primary)';
                          }
                        }}
                      >
                        {item.title}
                      </a>
                      
                      {/* Progress indicator for active item */}
                      {item.isActive && intersectionRatio > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            right: 'var(--space-2)',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-accent)',
                            opacity: intersectionRatio,
                            transition: 'opacity var(--transition-fast)',
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </nav>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      <style>{`
        @media (max-width: 768px) {
          .sophisticated-navigation {
            display: none !important;
          }
        }
        
        /* Ensure main content has proper margin when navigation is expanded */
        @media (min-width: 769px) {
          .main-content {
            margin-right: ${isExpanded ? '320px' : '48px'};
            transition: margin-right var(--transition-normal);
          }
        }
      `}</style>
    </>
  );
};

export default SophisticatedNavigation;