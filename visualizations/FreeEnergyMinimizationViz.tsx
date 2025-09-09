import React, { useState } from 'react';

const FreeEnergyMinimizationViz: React.FC = () => {
    const [minimized, setMinimized] = useState(false);
    
    const buttonStyle: React.CSSProperties = {
        display: 'block', width: '100%', padding: '0.75rem', fontSize: '1rem',
        cursor: 'pointer', background: '#FDFBF6', color: '#3A3A3A',
        border: '1px solid #C1C1C1', borderRadius: '4px',
        fontFamily: 'Georgia, serif', marginTop: '1rem', transition: 'background 0.2s ease',
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Free Energy Minimization</h4>
            <svg viewBox="0 0 300 200">
                <defs>
                    <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
                        <circle cx="10" cy="10" r={minimized ? 2 : 1} fill="#5A5A5A" style={{ transition: 'all 1s ease' }} />
                    </pattern>
                    <filter id="static-filter">
                        <feTurbulence type="fractalNoise" baseFrequency={minimized ? 0.4 : 0.8} numOctaves="3" stitchTiles="stitch" />
                    </filter>
                </defs>
                <rect width="300" height="200" fill="url(#dots)" />
                <rect width="300" height="200" filter="url(#static-filter)" opacity={minimized ? 0.05 : 0.15} style={{ transition: 'opacity 1s ease' }} />
            </svg>
            <button onClick={() => setMinimized(!minimized)} style={buttonStyle}>
                {minimized ? 'Increase Surprise' : 'Minimize Surprise'}
            </button>
        </div>
    );
};

export default FreeEnergyMinimizationViz;