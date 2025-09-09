import React from 'react';
import { ContentMetadata } from '../types';

interface ContentMetadataDisplayProps {
  metadata: ContentMetadata;
  showDetailed?: boolean;
}

const ContentMetadataDisplay: React.FC<ContentMetadataDisplayProps> = ({ 
  metadata, 
  showDetailed = false 
}) => {
  const getComplexityColor = (complexity: ContentMetadata['complexity']) => {
    switch (complexity) {
      case 'foundational':
        return 'var(--color-success)';
      case 'intermediate':
        return 'var(--color-warning)';
      case 'advanced':
        return 'var(--color-error)';
      default:
        return 'var(--color-text-muted)';
    }
  };

  const getComplexityIcon = (complexity: ContentMetadata['complexity']) => {
    switch (complexity) {
      case 'foundational':
        return '●';
      case 'intermediate':
        return '●●';
      case 'advanced':
        return '●●●';
      default:
        return '●';
    }
  };

  if (!showDetailed) {
    // Compact display for inline use
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-family-primary)',
      }}>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
        }}>
          <span>📖</span>
          <span>{metadata.readingTime} min</span>
        </span>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
          color: getComplexityColor(metadata.complexity),
        }}>
          <span>{getComplexityIcon(metadata.complexity)}</span>
          <span style={{ textTransform: 'capitalize' }}>{metadata.complexity}</span>
        </span>
      </div>
    );
  }

  // Detailed display for section headers
  return (
    <div style={{
      background: 'var(--color-surface-subtle)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      marginBottom: 'var(--space-6)',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-family-primary)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-3)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          <span>📖</span>
          <span>
            <strong>Reading Time:</strong> {metadata.readingTime} minutes
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          <span style={{ color: getComplexityColor(metadata.complexity) }}>
            {getComplexityIcon(metadata.complexity)}
          </span>
          <span>
            <strong>Complexity:</strong> 
            <span style={{ 
              textTransform: 'capitalize',
              color: getComplexityColor(metadata.complexity),
              fontWeight: 'var(--font-weight-medium)',
              marginLeft: 'var(--space-1)',
            }}>
              {metadata.complexity}
            </span>
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          <span>📊</span>
          <span>
            <strong>Words:</strong> {metadata.wordCount.toLocaleString()}
          </span>
        </div>
      </div>
      
      {metadata.concepts.length > 0 && (
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <strong style={{ 
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-2)',
            display: 'block',
          }}>
            Key Concepts:
          </strong>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
          }}>
            {metadata.concepts.map((concept, index) => (
              <span
                key={index}
                style={{
                  background: 'var(--color-accent-subtle)',
                  color: 'var(--color-accent)',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  textTransform: 'capitalize',
                }}
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {metadata.keywords.length > 0 && (
        <div>
          <strong style={{ 
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-2)',
            display: 'block',
          }}>
            Keywords:
          </strong>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
          }}>
            {metadata.keywords.map((keyword, index) => (
              <span
                key={index}
                style={{
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-tertiary)',
                  border: '1px solid var(--color-border)',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  textTransform: 'capitalize',
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentMetadataDisplay;