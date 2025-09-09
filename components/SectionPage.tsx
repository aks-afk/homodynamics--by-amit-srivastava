import React from 'react';
import { Section } from '../types';
import ContentDisplay from './ContentDisplay';
import ContentMetadataDisplay from './ContentMetadataDisplay';
import { getTotalReadingTime } from '../utils/contentAnalysis';

interface SectionPageProps {
  section: Section;
}

const SectionPage: React.FC<SectionPageProps> = ({ section }) => {
  const totalReadingTime = getTotalReadingTime(section);
  
  return (
    <div>
      <article>
        <header>
          <h2 style={{ 
            fontSize: 'var(--text-4xl)', 
            margin: 0,
            color: 'var(--color-text-primary)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--space-4)',
          }}>
            {section.title}
          </h2>
          <div style={{width: '80px', height: '2px', backgroundColor: 'var(--color-accent)', marginBottom: 'var(--space-6)'}}></div>
        </header>
        <div>
          {section.subSections.map((subSection, index) => (
              <ContentDisplay 
                key={subSection.id} 
                subSection={subSection} 
                isLast={index === section.subSections.length - 1}
              />
          ))}
        </div>
        
        {/* Metadata moved to bottom of page */}
        {(section.metadata || totalReadingTime > 0) && (
          <footer style={{
            marginTop: 'var(--space-12)',
            paddingTop: 'var(--space-8)',
            borderTop: '1px solid var(--color-border-subtle)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: section.metadata ? 'var(--space-4)' : '0',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
            }}>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                margin: 0,
                color: 'var(--color-text-primary)',
                fontWeight: 'var(--font-weight-medium)',
              }}>
                Section Information
              </h3>
              {totalReadingTime > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-family-primary)',
                }}>
                  <span>📖</span>
                  <span>{totalReadingTime} min read</span>
                </div>
              )}
            </div>
            {section.metadata && (
              <ContentMetadataDisplay metadata={section.metadata} showDetailed={true} />
            )}
          </footer>
        )}
      </article>
    </div>
  );
};

export default SectionPage;