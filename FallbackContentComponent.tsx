import React from 'react';
import { gracefulDegradation } from '../utils/gracefulDegradation';

interface FallbackContentComponentProps {
    componentName: string;
}

export const FallbackContentComponent: React.FC<FallbackContentComponentProps> = ({ componentName }) => {
    const content = gracefulDegradation.getFallbackContent(componentName);

    if (!content) {
        return (
            <div style={{
                padding: 'var(--space-6)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-sm)',
            }}>
                Content temporarily unavailable
            </div>
        );
    }

    return (
        <div style={{
            padding: 'var(--space-6)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
        }}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
                <h3 style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-2)',
                }}>
                    {content.title}
                </h3>
                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--text-sm)',
                    marginBottom: 'var(--space-4)',
                }}>
                    {content.description}
                </p>
            </div>
            {content.textContent && (
                <div style={{
                    textAlign: 'left',
                    lineHeight: 'var(--line-height-relaxed)',
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--text-sm)',
                    marginBottom: 'var(--space-4)',
                }}>
                    {content.textContent}
                </div>
            )}
            {content.actionText && content.actionUrl && (
                <a
                    href={content.actionUrl}
                    style={{
                        display: 'inline-block',
                        background: 'var(--color-accent)',
                        color: 'white',
                        padding: 'var(--space-2) var(--space-4)',
                        borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                    }}
                >
                    {content.actionText}
                </a>
            )}
        </div>
    );
};

export default FallbackContentComponent;