import React from 'react';

const AdaptiveResponseViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Adaptive Responses</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                <style>{`
                    .shape { animation: perturb 4s ease-in-out infinite; transform-origin: center; }
                    .arrow { animation: poke 4s ease-in-out infinite; }
                    @keyframes perturb {
                        0%, 100% { transform: scale(1, 1); }
                        25% { transform: scale(0.9, 1.1) translateX(-5px); }
                        50% { transform: scale(1.05, 0.95); }
                        75% { transform: scale(1, 1); }
                    }
                    @keyframes poke {
                        0%, 50%, 100% { transform: translateX(0); opacity: 0; }
                        20% { transform: translateX(50px); opacity: 1; }
                        25% { transform: translateX(55px); opacity: 0; }
                    }
                `}</style>

                {/* Flexible Shape */}
                <ellipse className="shape" cx="180" cy="100" rx="40" ry="60" fill="rgba(138, 138, 138, 0.3)" stroke="#5A5A5A" strokeWidth="2" />
                
                {/* Perturbation Arrow */}
                <g className="arrow">
                    <line x1="50" y1="100" x2="110" y2="100" stroke="#3A3A3A" strokeWidth="2.5" />
                    <polygon points="110,95 125,100 110,105" fill="#3A3A3A" />
                    <text x="75" y="85" textAnchor="middle" fontSize="12">Perturbation</text>
                </g>
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                Resilient systems absorb external shocks and return to a stable state.
            </p>
        </div>
    );
};

export default AdaptiveResponseViz;