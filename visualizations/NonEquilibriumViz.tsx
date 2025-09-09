import React from 'react';

const NonEquilibriumViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Non-Equilibrium Thermodynamics</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                 <style>{`
                    .particle { animation: random-walk 10s linear infinite; }
                    @keyframes random-walk {
                        0% { transform: translate(0, 0); } 25% { transform: translate(5px, -3px); }
                        50% { transform: translate(-2px, 4px); } 75% { transform: translate(3px, 2px); } 100% { transform: translate(0, 0); }
                    }
                    .energy-in { animation: energy-flow 3s linear infinite; }
                    @keyframes energy-flow { from { opacity: 0; } to { opacity: 1; } }
                `}</style>
                {/* System Boundary */}
                <rect x="50" y="50" width="200" height="100" fill="none" stroke="#C1C1C1" />

                {/* Energy Input */}
                <g className="energy-in">
                    <line x1="10" y1="100" x2="50" y2="100" stroke="#3A3A3A" strokeWidth="2" />
                    <text x="25" y="90" fontSize="12">Energy</text>
                </g>

                {/* Particles */}
                <g>
                    {Array.from({ length: 15 }).map((_, i) => (
                        <circle key={i} className="particle" cx={70 + (i % 5) * 40} cy={70 + Math.floor(i / 5) * 30} r="4" fill="#5A5A5A" style={{ animationDelay: `${Math.random() * 5}s`}} />
                    ))}
                </g>
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                Living systems maintain a state of low entropy (high organization) by constantly taking in energy.
            </p>
        </div>
    );
};

export default NonEquilibriumViz;