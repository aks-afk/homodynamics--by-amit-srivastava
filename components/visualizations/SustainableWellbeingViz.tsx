import React from 'react';

const SustainableWellbeingViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Sustainable Well-being</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                 <style>{`
                    .top { animation: spin-wobble 8s ease-in-out infinite; transform-origin: 150px 150px; }
                    @keyframes spin-wobble {
                        0% { transform: rotateY(0deg) rotateX(10deg); }
                        25% { transform: rotateY(90deg) rotateX(-5deg); }
                        50% { transform: rotateY(180deg) rotateX(10deg); }
                        75% { transform: rotateY(270deg) rotateX(-5deg); }
                        100% { transform: rotateY(360deg) rotateX(10deg); }
                    }
                `}</style>
                <g className="top">
                    <ellipse cx="150" cy="80" rx="50" ry="15" fill="#C1C1C1" />
                    <path d="M 100 80 L 150 150 L 200 80 Z" fill="#8A8A8A" />
                    <ellipse cx="150" cy="80" rx="50" ry="15" fill="none" stroke="#3A3A3A" strokeWidth="1" />
                </g>
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                True well-being is not static, but a state of dynamic stability achieved through motion.
            </p>
        </div>
    );
};

export default SustainableWellbeingViz;