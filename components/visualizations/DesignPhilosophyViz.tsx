import React from 'react';

const DesignPhilosophyViz: React.FC = () => {
    const colors = [
        { hex: '#3A3A3A', name: 'Primary Text' },
        { hex: '#5A5A5A', name: 'Secondary Text' },
        { hex: '#8A8A8A', name: 'Muted Accent' },
        { hex: '#C1C1C1', name: 'Borders' },
        { hex: '#EAE8E1', name: 'Light Borders' },
        { hex: '#FCFBF8', name: 'Background' },
    ];

    const containerStyle: React.CSSProperties = {
        padding: '1rem',
        borderRadius: '4px',
        background: '#F1F0EC',
        border: '1px solid #EAE8E1',
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Design Philosophy</h4>
            <div style={containerStyle}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '4rem', lineHeight: 1, color: '#3A3A3A' }}>Ag</div>
                    <div style={{ fontSize: '0.9rem', color: '#5A5A5A', marginTop: '0.25rem' }}>Georgia Serif</div>
                </div>
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                        {colors.map(color => (
                            <div key={color.hex}>
                                <div style={{ width: '100%', paddingTop: '100%', backgroundColor: color.hex, borderRadius: '4px', border: '1px solid #EAE8E1' }} />
                            </div>
                        ))}
                    </div>
                     <div style={{ fontSize: '0.9rem', color: '#5A5A5A', marginTop: '0.5rem', textAlign: 'center' }}>Muted Color Palette</div>
                </div>
            </div>
        </div>
    );
};

export default DesignPhilosophyViz;