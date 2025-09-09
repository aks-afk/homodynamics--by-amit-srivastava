import React from 'react';

const AppetiteViz: React.FC = () => {
    const boxStyle: React.CSSProperties = {
        border: '1px solid #C1C1C1',
        borderRadius: '4px',
        padding: '0.5rem',
        textAlign: 'center',
        background: '#FCFBF8',
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Appetite: The Bodily Drives</h4>
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 300 250" style={{ width: '100%', height: 'auto', position: 'relative' }}>
                    <defs>
                        <path id="loopPath" d="M 150,50 A 80 80 0 1 1 150, 210 A 80 80 0 1 1 150, 50" fill="none" />
                        <marker id="arrow-appetite" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#8A8A8A" />
                        </marker>
                    </defs>
                    
                    <path d="M 150,50 A 80 80 0 1 1 150, 210 A 80 80 0 1 1 150, 50" stroke="#C1C1C1" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                    
                    <circle r="6" fill="#3A3A3A">
                        <animateMotion dur="6s" repeatCount="indefinite" path="M 150,50 A 80 80 0 1 1 150, 210 A 80 80 0 1 1 150, 50" />
                    </circle>

                    <foreignObject x="110" y="15" width="80" height="40">
                        <div style={boxStyle}>Need</div>
                    </foreignObject>
                     <foreignObject x="30" y="105" width="80" height="40">
                        <div style={boxStyle}>Action</div>
                    </foreignObject>
                    <foreignObject x="180" y="105" width="90" height="40">
                        <div style={boxStyle}>Satisfaction</div>
                    </foreignObject>
                </svg>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                The fundamental feedback loop of bodily needs and drives.
            </p>
        </div>
    );
};

export default AppetiteViz;