import React, { useState } from 'react';
import { Section, SubSection } from '../types';

interface HeaderProps {
  sections: Section[];
  currentSectionId: string;
  onSelectSection: (sectionId: string, elementId?: string) => void;
}

const MobileNavLink: React.FC<{
  onClick: () => void;
  isActive: boolean;
  isSubItem?: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, isSubItem, children }) => {
  const style: React.CSSProperties = {
    display: 'block',
    padding: 'var(--space-3) var(--space-4)',
    textDecoration: 'none',
    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
    fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
    background: isActive ? 'var(--color-surface-subtle)' : 'transparent',
    borderRadius: 'var(--radius-md)',
    paddingLeft: isSubItem ? 'var(--space-8)' : 'var(--space-4)',
    fontSize: isSubItem ? 'var(--text-base)' : 'var(--text-lg)',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer'
  };

  return (
    <a 
      href="#" 
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); onClick(); }} 
      onKeyDown={(e: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={style}
      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!isActive) {
          (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface-subtle)';
        }
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!isActive) {
          (e.target as HTMLElement).style.backgroundColor = 'transparent';
        }
      }}
      role="menuitem"
      aria-current={isActive ? "page" : undefined}
      aria-label={`Navigate to ${children}${isSubItem ? ' (subsection)' : ''}`}
    >
      {children}
    </a>
  );
};

const Header: React.FC<HeaderProps> = ({ sections, currentSectionId, onSelectSection }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Create a hierarchical navigation structure
  interface NavItem {
    id: string;
    title: string;
    shortTitle: string;
    children?: Section[];
  }

  const navStructure = sections.reduce<NavItem[]>((acc, section) => {
    if (section.type === 'header') {
      acc.push({
        id: section.id,
        title: section.title,
        shortTitle: section.title.split(':')[0],
        children: []
      });
    } else if (acc.length > 0 && Array.isArray(acc[acc.length - 1].children)) {
      acc[acc.length - 1].children!.push(section);
    } else {
      acc.push({
        id: section.id,
        title: section.title,
        shortTitle: section.shortTitle,
        children: undefined
      });
    }
    return acc;
  }, []);

  const handleLinkClick = (sectionId: string, elementId?: string) => {
    onSelectSection(sectionId, elementId);
    setIsMobileMenuOpen(false);
  };

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '70px',
    backgroundColor: 'rgba(250, 248, 244, 0.95)',
    borderBottom: '1px solid var(--color-border)',
    zIndex: 900,
    display: 'flex',
    alignItems: 'center',
    padding: '0 var(--space-8)',
    boxShadow: '0 2px 12px rgba(44, 42, 38, 0.08)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  };
  
  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--text-2xl)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-family-primary)',
    fontWeight: 'var(--font-weight-bold)',
    margin: 0,
    letterSpacing: 'var(--letter-spacing-tight)',
    cursor: 'pointer',
    transition: 'color var(--transition-fast)',
  };

  const navListStyle: React.CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    gap: 'var(--space-6)',
  };

  const navLinkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--text-base)',
    padding: 'var(--space-3) var(--space-4)',
    position: 'relative',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
    fontWeight: 'var(--font-weight-medium)',
    letterSpacing: 'var(--letter-spacing-normal)',
  };

  const activeNavLinkStyle: React.CSSProperties = {
    color: 'var(--color-text-primary)',
    fontWeight: 'var(--font-weight-semibold)',
    backgroundColor: 'var(--color-surface-subtle)',
  };

  const dropdownMenuStyle: React.CSSProperties = {
    display: 'block',
    position: 'absolute',
    top: '100%',
    left: '-var(--space-4)',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-lg)',
    listStyle: 'none',
    padding: 'var(--space-2) 0',
    marginTop: 'var(--space-2)',
    borderRadius: 'var(--radius-lg)',
    minWidth: '240px',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    animation: 'fadeInDown 0.2s ease-out',
  };

  const dropdownItemStyle: React.CSSProperties = {
    display: 'block',
    padding: 'var(--space-3) var(--space-5)',
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    fontSize: 'var(--text-sm)',
    transition: 'all var(--transition-fast)',
    borderRadius: 'var(--radius-md)',
    margin: '0 var(--space-2)',
    fontWeight: 'var(--font-weight-medium)',
  };

  return (
    <>
      <header style={headerStyle} className="top-header">
        <div style={containerStyle}>
          <h1 
            style={titleStyle}
            onClick={() => onSelectSection('about')}
            onKeyDown={(e: React.KeyboardEvent<HTMLHeadingElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectSection('about');
              }
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLHeadingElement>) => {
              (e.target as HTMLElement).style.color = 'var(--color-accent)';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLHeadingElement>) => {
              (e.target as HTMLElement).style.color = 'var(--color-text-primary)';
            }}
            tabIndex={0}
            role="button"
            aria-label="Go to About section"
          >
            Homodynamics
          </h1>
          
          <nav className="desktop-nav" aria-label="Main navigation">
            <ul style={navListStyle} role="menubar">
              {navStructure.map(item => {
                const isParentOfCurrent = item.children?.some((c: Section) => c.id === currentSectionId);
                return (
                  <li 
                    key={item.id}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => item.children && setOpenDropdown(item.id)}
                    onMouseLeave={() => item.children && setOpenDropdown(null)}
                    role="none"
                  >
                    <a 
                      href={item.children ? undefined : `#${item.id}`}
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { 
                        if (!item.children) {
                          e.preventDefault(); 
                          onSelectSection(item.id); 
                        }
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLAnchorElement>) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (!item.children) {
                            onSelectSection(item.id);
                          }
                        } else if (e.key === 'ArrowDown' && item.children) {
                          e.preventDefault();
                          setOpenDropdown(item.id);
                        } else if (e.key === 'Escape') {
                          setOpenDropdown(null);
                        }
                      }}
                      style={{...navLinkStyle, ...((currentSectionId === item.id || isParentOfCurrent) ? activeNavLinkStyle : {})}}
                      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        if (!(currentSectionId === item.id || isParentOfCurrent)) {
                          (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface-subtle)';
                          (e.target as HTMLElement).style.color = 'var(--color-text-primary)';
                        }
                      }}
                      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        if (!(currentSectionId === item.id || isParentOfCurrent)) {
                          (e.target as HTMLElement).style.backgroundColor = 'transparent';
                          (e.target as HTMLElement).style.color = 'var(--color-text-secondary)';
                        }
                      }}
                      role={item.children ? "menuitem" : "menuitem"}
                      aria-haspopup={item.children ? "true" : "false"}
                      aria-expanded={item.children ? (openDropdown === item.id ? "true" : "false") : undefined}
                      aria-current={currentSectionId === item.id ? "page" : undefined}
                      aria-label={`Navigate to ${item.shortTitle}${item.children ? ' (has submenu)' : ''}`}
                    >
                      {item.shortTitle}
                    </a>

                    {item.children && openDropdown === item.id && (
                      <ul style={dropdownMenuStyle} role="menu" aria-label={`${item.shortTitle} submenu`}>
                        {item.children.map((child: Section, index: number) => (
                          <li key={child.id} role="none">
                            <a 
                              href={`#${child.id}`}
                              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); onSelectSection(child.id); setOpenDropdown(null); }}
                              onKeyDown={(e: React.KeyboardEvent<HTMLAnchorElement>) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  onSelectSection(child.id);
                                  setOpenDropdown(null);
                                } else if (e.key === 'Escape') {
                                  setOpenDropdown(null);
                                  // Focus back to parent menu item
                                  (e.target as HTMLElement).closest('li')?.querySelector('a')?.focus();
                                } else if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  const nextItem = item.children![index + 1];
                                  if (nextItem) {
                                    const nextLink = document.querySelector(`a[href="#${nextItem.id}"]`) as HTMLElement;
                                    nextLink?.focus();
                                  }
                                } else if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  const prevItem = item.children![index - 1];
                                  if (prevItem) {
                                    const prevLink = document.querySelector(`a[href="#${prevItem.id}"]`) as HTMLElement;
                                    prevLink?.focus();
                                  }
                                }
                              }}
                              style={dropdownItemStyle}
                              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface-subtle)';
                                (e.target as HTMLElement).style.color = 'var(--color-text-primary)';
                              }}
                              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                (e.target as HTMLElement).style.backgroundColor = 'transparent';
                                (e.target as HTMLElement).style.color = 'var(--color-text-secondary)';
                              }}
                              role="menuitem"
                              aria-current={currentSectionId === child.id ? "page" : undefined}
                            >
                              {child.shortTitle}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mobile-menu-button-container">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="mobile-menu-button" 
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <div style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(7px, 7px)' : 'none', backgroundColor: 'var(--color-text-primary)' }} />
              <div style={{ opacity: isMobileMenuOpen ? 0 : 1, backgroundColor: 'var(--color-text-primary)' }} />
              <div style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none', backgroundColor: 'var(--color-text-primary)' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`mobile-nav-overlay ${isMobileMenuOpen ? 'is-open' : ''}`}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <nav aria-label="Mobile navigation">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} role="menu">
            {navStructure.map(item => {
              const isCurrentPart = item.children?.some((child: Section) => child.id === currentSectionId);
              // Render a "Part" header with its children
              if (item.children) {
                return (
                  <li key={item.id} style={{ marginBottom: 'var(--space-4)' }}>
                    <h2 style={{
                      fontSize: 'var(--text-sm)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--letter-spacing-wide)',
                      color: isCurrentPart ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                      margin: '0 0 var(--space-2) var(--space-4)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}>
                      {item.shortTitle}
                    </h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {item.children.map((childSection: Section) => (
                        <li key={childSection.id}>
                          <MobileNavLink
                            onClick={() => handleLinkClick(childSection.id)}
                            isActive={childSection.id === currentSectionId}
                          >
                            {childSection.shortTitle}
                          </MobileNavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              // Render a top-level section (About, Introduction)
              return (
                <li key={item.id} style={{ marginBottom: 'var(--space-4)' }}>
                  <MobileNavLink
                    onClick={() => handleLinkClick(item.id)}
                    isActive={item.id === currentSectionId}
                  >
                    {item.shortTitle}
                  </MobileNavLink>
                  {/* Also show subsections for all items */}
                  {item.id === currentSectionId && (() => {
                    const currentSection = sections.find(s => s.id === item.id);
                    return currentSection?.subSections && (
                      <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-1) 0' }}>
                        {currentSection.subSections.map((subSection: SubSection) => (
                          <li key={subSection.id}>
                            <MobileNavLink
                              isSubItem
                              onClick={() => handleLinkClick(item.id, subSection.id)}
                              isActive={false} // No persistent active state for subsections
                            >
                              {subSection.title || <em>(Introduction)</em>}
                            </MobileNavLink>
                          </li>
                        ))}
                      </ul>
                    );
                  })()}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;