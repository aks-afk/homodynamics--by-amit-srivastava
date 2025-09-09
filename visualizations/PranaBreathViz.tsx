import React from 'react';

const PranaBreathViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Prāṇa as Essential Breath</h4>
            <svg viewBox="0 0 300 250" style={{ width: '100%', height: 'auto' }}>
                <style>{`
                    .lung { animation: breathe 5s ease-in-out infinite; transform-origin: center bottom; }
                    @keyframes breathe {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    .particle-in { animation: flow-in 5s linear infinite; }
                    .particle-out { animation: flow-out 5s linear infinite; }
                    @keyframes flow-in {
                        0% { transform: translate(150px, 0px); opacity: 0; }
                        40% { transform: translate(150px, 125px); opacity: 1; }
                        50% { opacity: 0; }
                        100% { opacity: 0; }
                    }
                     @keyframes flow-out {
                        0%, 50% { opacity: 0; }
                        60% { transform: translate(150px, 125px); opacity: 1; }
                        100% { transform: translate(150px, 0px); opacity: 0; }
                    }
                `}</style>

                {/* Lungs */}
                <g className="lung">
                    <path d="M 150 100 C 100 100, 80 150, 100 200 L 150 200 Z" fill="rgba(138, 138, 138, 0.3)" />
                    <path d="M 150 100 C 200 100, 220 150, 200 200 L 150 200 Z" fill="rgba(138, 138, 138, 0.3)" />
                </g>
                <path d="M 150 50 V 100" stroke="#3A3A3A" strokeWidth="3" />
                
                {/* Particles */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <g key={i}>
                        <circle className="particle-in" r="3" fill="#3A3A3A" style={{ animationDelay: `${i * 0.3}s` }} />
                        <circle className="particle-out" r="2.5" fill="#8A8A8A" style={{ animationDelay: `${i * 0.3}s` }} />
                    </g>
                ))}

            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                The intake and circulation of vital energy through the mechanism of breath.
            </p>
        </div>
    );
};

export default PranaBreathViz;