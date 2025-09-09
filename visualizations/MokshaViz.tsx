import React, { useState } from 'react';

const MokshaViz: React.FC = () => {
    const [liberated, setLiberated] = useState(false);

    const buttonStyle: React.CSSProperties = {
        display: 'block', width: '100%', padding: '0.75rem', fontSize: '1rem',
        cursor: 'pointer', background: '#FDFBF6', color: '#3A3A3A',
        border: '1px solid #C1C1C1', borderRadius: '4px',
        fontFamily: 'Georgia, serif', marginTop: '1rem', transition: 'background 0.2s ease',
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Mokṣa: Liberation</h4>
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 300 220">
                    <defs>
                        <radialGradient id="moksha-glow">
                            <stop offset="0%" stopColor="rgba(252, 251, 248, 1)" />
                            <stop offset="100%" stopColor="rgba(252, 251, 248, 0)" />
                        </radialGradient>
                    </defs>

                    {/* The cage/boundary */}
                    <circle 
                        cx="150" cy="110" r="40"
                        fill="none"
                        stroke="#8A8A8A"
                        strokeWidth="2"
                        strokeDasharray="8 4"
                        opacity={liberated ? 0 : 1}
                        style={{ transition: 'opacity 1.5s ease' }}
                    />
                    
                    {/* The expanding light */}
                    <circle 
                        cx="150" cy="110" 
                        r={liberated ? 120 : 10}
                        fill="url(#moksha-glow)"
                        style={{ transition: 'r 2s cubic-bezier(0.25, 1, 0.5, 1)' }}
                    />
                     <circle 
                        cx="150" cy="110" 
                        r={liberated ? 20 : 5}
                        fill="#FCFBF8"
                        style={{ transition: 'r 1.5s ease' }}
                    />
                </svg>
            </div>
            <button onClick={() => setLiberated(!liberated)} style={buttonStyle}>
                {liberated ? 'Contain' : 'Liberate'}
            </button>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                The transcendence of boundaries and realization of the true self.
            </p>
        </div>
    );
};

export default MokshaViz;