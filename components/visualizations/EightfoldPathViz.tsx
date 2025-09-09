import React, { useState } from 'react';

const EightfoldPathViz: React.FC = () => {
    const [hoveredPillar, setHoveredPillar] = useState<string | null>(null);

    const pillars = {
        wisdom: ['Right View', 'Right Intention'],
        conduct: ['Right Speech', 'Right Action', 'Right Livelihood'],
        discipline: ['Right Effort', 'Right Mindfulness', 'Right Concentration'],
    };

    const isPathHighlighted = (path: string) => {
        if (!hoveredPillar) return false;
        return (pillars as any)[hoveredPillar].includes(path);
    };

    const Pillar = ({ name, title }: { name: string, title: string }) => (
        <div
            onMouseEnter={() => setHoveredPillar(name)}
            onMouseLeave={() => setHoveredPillar(null)}
            style={{
                padding: '0.5rem',
                border: `1px solid ${hoveredPillar === name ? '#3A3A3A' : '#C1C1C1'}`,
                borderRadius: '4px',
                textAlign: 'center',
                background: hoveredPillar === name ? '#F1F0EC' : '#FCFBF8',
                cursor: 'default',
                transition: 'all 0.2s ease',
            }}
        >
            {title}
        </div>
    );
    
    const Path = ({ name }: { name: string }) => (
        <div style={{
            padding: '0.5rem',
            border: `1px solid ${isPathHighlighted(name) ? '#3A3A3A' : '#EAE8E1'}`,
            borderRadius: '4px',
            background: isPathHighlighted(name) ? '#F1F0EC' : '#FCFBF8',
            textAlign: 'center',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
        }}>
            {name}
        </div>
    );

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>The Noble Eightfold Path</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                <Pillar name="wisdom" title="Wisdom" />
                <Pillar name="conduct" title="Ethical Conduct" />
                <Pillar name="discipline" title="Mental Discipline" />
            </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Path name="Right View" />
                <Path name="Right Intention" />
                <Path name="Right Speech" />
                <Path name="Right Action" />
                <Path name="Right Livelihood" />
                <Path name="Right Effort" />
                <Path name="Right Mindfulness" />
                <Path name="Right Concentration" />
            </div>
            <p style={{fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem'}}>Hover over the pillars to see the connected paths.</p>
        </div>
    );
};

export default EightfoldPathViz;