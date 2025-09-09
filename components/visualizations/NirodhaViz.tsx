import React, { useState } from 'react';

const NirodhaViz: React.FC = () => {
    const [isReleased, setIsReleased] = useState(false);

    const buttonStyle: React.CSSProperties = {
        display: 'block', width: '100%', padding: '0.75rem', fontSize: '1rem',
        cursor: 'pointer', background: '#FDFBF6', color: '#3A3A3A',
        border: '1px solid #C1C1C1', borderRadius: '4px',
        fontFamily: 'Georgia, serif', marginTop: '1rem', transition: 'background 0.2s ease',
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Nirodha: The Cessation</h4>
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 300 220" style={{ width: '100%', height: 'auto' }}>
                    {/* The Self */}
                    <defs>
                        <radialGradient id="glow-gradient">
                            <stop offset="50%" stopColor="#FCFBF8" />
                            <stop offset="100%" stopColor="#F1F0EC" />
                        </radialGradient>
                    </defs>
                    <circle 
                        cx="150" cy="110" r="25" 
                        fill="url(#glow-gradient)"
                        stroke="#3A3A3A" 
                        strokeWidth={isReleased ? 1.5 : 2}
                        style={{ transition: 'all 1s ease' }}
                    />
                     <circle 
                        cx="150" cy="110" r={isReleased ? 50 : 25}
                        fill="#FDFBF6"
                        opacity={isReleased ? 0.2 : 0}
                        style={{ transition: 'all 1.5s ease' }}
                    />
                    
                    {/* Vines */}
                    <g opacity={isReleased ? 0 : 1} style={{ transition: 'opacity 1s ease' }}>
                        <path d="M 125 110 C 100 80, 200 80, 175 110 S 100 140, 125 110" stroke="#8A8A8A" strokeWidth="3" fill="none" />
                        <path d="M 150 85 C 120 70, 180 70, 150 85" stroke="#8A8A8A" strokeWidth="2" fill="none" />
                        <path d="M 150 135 C 130 150, 170 150, 150 135" stroke="#8A8A8A" strokeWidth="2" fill="none" />
                    </g>
                </svg>
            </div>
            <button onClick={() => setIsReleased(!isReleased)} style={buttonStyle}>
                {isReleased ? 'Re-attach' : 'Let Go'}
            </button>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                By relinquishing attachment, suffering ceases.
            </p>
        </div>
    );
};

export default NirodhaViz;