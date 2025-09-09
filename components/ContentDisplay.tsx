import React from 'react';
import { SubSection } from '../types';
import ContentReadingEnhancer from './ContentReadingEnhancer';
import DynamicVisualization from './DynamicVisualization';

interface ContentDisplayProps {
  subSection: SubSection;
  isLast: boolean;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ subSection, isLast }) => {

  const VisualizationContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <div className="visualization-wrapper" style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-surface)',
          padding: 'var(--space-6)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all var(--transition-normal)',
      }}>
          {children}
      </div>
  );

  const renderParagraph = (p: string, i: number) => (
      <p 
          key={i} 
          style={{ 
              lineHeight: 'var(--line-height-relaxed)', 
              fontSize: 'var(--text-lg)', 
              color: 'var(--color-text-secondary)', 
              margin: '0 0 var(--space-6) 0',
              maxWidth: '65ch', // Optimal reading width
              fontFamily: 'var(--font-family-primary)',
              letterSpacing: 'var(--letter-spacing-normal)',
          }} 
          dangerouslySetInnerHTML={{ __html: p.replace(/<strong>(.*?)<\/strong>/g, '<strong style="color: var(--color-text-primary); font-weight: var(--font-weight-semibold);">$1</strong>').replace(/<u>(.*?)<\/u>/g, '<u style="text-decoration-color: var(--color-text-muted); text-decoration-thickness: 1px; text-underline-offset: 3px;">$1</u>') }} 
      />
  );
  
  const VisualizationComponent = subSection.component;
  const hasViz = VisualizationComponent && VisualizationComponent.name !== 'DummyViz';

  return (
    <section 
      id={`section-${subSection.id}`} 
      className="content-section"
      data-testid="content-display"
      style={{ 
        marginBottom: isLast ? 0 : 'var(--space-16)',
        paddingBottom: isLast ? 0 : 'var(--space-16)',
        borderBottom: isLast ? 'none' : '1px solid var(--color-border-subtle)',
        transition: 'all var(--transition-normal)',
      }}
    >
      <div 
        className="content-grid-desktop"
        style={{
          display: 'grid',
          gridTemplateColumns: hasViz ? '1fr 400px' : '1fr',
          gap: 'var(--space-8)',
          alignItems: 'start',
        }}
      >
        <ContentReadingEnhancer
          optimalWidth={!hasViz}
          enhancedTypography={true}
          enableFocusMode={true}
        >
          <div style={{
            maxWidth: hasViz ? 'none' : 'none', // Let ContentReadingEnhancer handle width
            margin: hasViz ? '0' : '0',
          }}>
            {subSection.title && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-4)',
                  flexWrap: 'wrap',
                  gap: 'var(--space-3)',
                }}>
                  <h3 id={subSection.id} style={{ 
                      fontSize: 'var(--text-3xl)', 
                      margin: 0,
                      color: 'var(--color-text-primary)',
                      fontWeight: 'var(--font-weight-semibold)',
                      scrollMarginTop: '90px', // Offset for sticky header
                      lineHeight: 'var(--line-height-tight)',
                      letterSpacing: 'var(--letter-spacing-tight)',
                      fontFamily: 'var(--font-family-primary)',
                  }}>
                      {subSection.title}
                  </h3>
                </div>
              </>
            )}
            <div style={{
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'all var(--transition-slow)',
            }}>
              {subSection.content.map(renderParagraph)}
            </div>
          </div>
        </ContentReadingEnhancer>
        
        {hasViz && (
          <div 
            data-testid="visualization-panel"
            style={{
              position: 'sticky',
              top: '100px',
              height: 'fit-content',
            }}
          >
            <VisualizationContainer>
              <DynamicVisualization Component={VisualizationComponent} />
            </VisualizationContainer>
          </div>
        )}
      </div>

      {/* RENDER NESTED SUB-SUBSECTIONS */}
      {subSection.subSections && subSection.subSections.map((subSubSection) => {
        const SubSubVisualizationComponent = subSubSection.component;
        const subHasViz = SubSubVisualizationComponent && SubSubVisualizationComponent.name !== 'DummyViz';
        
        return (
          <div key={subSubSection.id} 
            className="nested-subsection"
            style={{ 
              marginTop: 'var(--space-12)', 
              borderLeft: '3px solid var(--color-accent-subtle)', 
              paddingLeft: 'var(--space-8)',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              background: 'linear-gradient(90deg, var(--color-surface-subtle) 0%, transparent 100%)',
              transition: 'all var(--transition-normal)',
            }}>
            <div 
              className="content-grid-desktop"
              style={{
                display: 'grid',
                gridTemplateColumns: subHasViz ? '1fr 350px' : '1fr',
                gap: 'var(--space-6)',
                alignItems: 'start',
              }}
            >
                <ContentReadingEnhancer
                  optimalWidth={!subHasViz}
                  enhancedTypography={true}
                  enableFocusMode={false} // Disable focus mode for nested sections to avoid conflicts
                >
                  <div style={{
                    maxWidth: subHasViz ? 'none' : 'none', // Let ContentReadingEnhancer handle width
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--space-3)',
                      flexWrap: 'wrap',
                      gap: 'var(--space-2)',
                    }}>
                      <h4 id={subSubSection.id} style={{ 
                          fontSize: 'var(--text-2xl)', 
                          margin: 0,
                          color: 'var(--color-text-primary)',
                          fontWeight: 'var(--font-weight-semibold)',
                          scrollMarginTop: '90px', // Offset for sticky header
                          lineHeight: 'var(--line-height-tight)',
                          letterSpacing: 'var(--letter-spacing-tight)',
                          fontFamily: 'var(--font-family-primary)',
                      }}>
                          {subSubSection.title}
                      </h4>
                    </div>
                    <div style={{
                      opacity: 1,
                      transform: 'translateY(0)',
                      transition: 'all var(--transition-slow)',
                    }}>
                      {subSubSection.content.map(renderParagraph)}
                    </div>
                  </div>
                </ContentReadingEnhancer>

                {subHasViz && (
                  <div style={{
                    position: 'sticky',
                    top: '120px',
                    height: 'fit-content',
                  }}>
                    <VisualizationContainer>
                      <DynamicVisualization Component={SubSubVisualizationComponent} />
                    </VisualizationContainer>
                  </div>
                )}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ContentDisplay;