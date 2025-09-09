import React, { useState } from 'react';

const SystemsTheoryLensViz: React.FC = () => {
    const [isFocused, setIsFocused] = useState(false);
    const size = 300;
    const center = size / 2;
    const numPoints = 12;

    const points = Array.from({ length: numPoints }, (_, i) => {
        const angle = (i / numPoints) * 2 * Math.PI;
        const radius = size / 2.5;
        return {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle),
        };
    });

    const buttonStyle: React.CSSProperties = {
        display: 'block',
        width: '100%',
        padding: '0.75rem',
        fontSize: '1rem',
        cursor: 'pointer',
        background: '#FDFBF6',
        color: '#3A3A3A',
        border: '1px solid #C1C1C1',
        borderRadius: '4px',
        fontFamily: 'Georgia, serif',
        marginTop: '1rem',
        transition: 'background 0.2s ease',
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>The Connecting Lens</h4>
            <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', height: 'auto' }}>
                {/* Lines */}
                <g>
                    {points.map((p, i) => (
                        <line
                            key={i}
                            x1={p.x}
                            y1={p.y}
                            x2={center}
                            y2={center}
                            stroke="#C1C1C1"
                            strokeWidth="1"
                            style={{
                                transition: 'all 0.5s ease',
                                transformOrigin: 'center center',
                                transform: isFocused ? 'scale(1)' : 'scale(0)',
                                opacity: isFocused ? 1 : 0,
                            }}
                        />
                    ))}
                </g>

                {/* Points */}
                <g>
                    {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#8A8A8A" />
                    ))}
                </g>
                
                {/* Lens */}
                <circle
                    cx={center}
                    cy={center}
                    r={size / 6}
                    fill={isFocused ? "#FCFBF8" : "transparent"}
                    stroke="#3A3A3A"
                    strokeWidth="2"
                    style={{ transition: 'all 0.5s ease' }}
                />
                 <text
                    x={center}
                    y={center}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="14"
                    fill="#3A3A3A"
                    style={{ transition: 'opacity 0.5s ease', opacity: isFocused ? 1 : 0 }}
                >
                    System
                </text>
            </svg>
            <button
                onClick={() => setIsFocused(!isFocused)}
                onMouseOver={(e) => (e.currentTarget.style.background = '#F1F0EC')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#FDFBF6')}
                style={buttonStyle}
            >
                {isFocused ? 'Remove Lens' : 'Apply Systems Lens'}
            </button>
        </div>
    );
};

export default SystemsTheoryLensViz;
