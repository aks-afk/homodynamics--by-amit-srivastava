import React, { useState } from 'react';

const SpiritViz: React.FC = () => {
    const [intensity, setIntensity] = useState(50);

    const flamePaths = [
        "M 150 200 C 120 150, 180 150, 150 100 Q 150 50, 150 0",
        "M 150 200 C 130 160, 170 160, 150 110 Q 150 60, 150 20",
        "M 150 200 C 140 170, 160 170, 150 120 Q 150 70, 150 40"
    ];

    const scale = 0.5 + (intensity / 100) * 0.8;
    const color = `rgba(255, ${165 - intensity}, 0, ${0.6 + intensity/250})`;

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Spirit: The Emotional Force</h4>
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 300 220">
                    <g transform={`scale(${scale}) translate(${(300 - 300*scale)/ (2*scale)}, ${(220 - 220*scale) / (2*scale)})`}>
                        {flamePaths.map((path, i) => (
                            <path
                                key={i}
                                d={path}
                                fill={color}
                                style={{ animation: `flicker ${2 + i}s infinite alternate ease-in-out` }}
                            />
                        ))}
                    </g>
                </svg>
                <style>{`
                    @keyframes flicker {
                        0% { transform: skewX(5deg) scaleY(1.0); }
                        50% { transform: skewX(-5deg) scaleY(1.05); }
                        100% { transform: skewX(5deg) scaleY(1.0); }
                    }
                `}</style>
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '0.2rem', color: '#5A5A5A', fontSize: '0.9rem' }}>Motivation</label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={intensity}
                    onChange={(e) => setIntensity(+e.target.value)}
                    style={{ width: '100%', accentColor: '#FFA500' }}
                />
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                Spirit provides the energy and drive to pursue goals.
            </p>
        </div>
    );
};

export default SpiritViz;