import React from 'react';

const RefiningMechanismsViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Refining Attentional Mechanisms</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                 <style>{`
                    .ray { animation: focus-ray 4s ease-in-out infinite alternate; }
                    @keyframes focus-ray {
                        from { stroke-width: 1; opacity: 0.5; }
                        to { stroke-width: 2; opacity: 1; }
                    }
                `}</style>
                {/* Lens */}
                <path d="M 120 20 C 180 60, 180 140, 120 180" stroke="#3A3A3A" strokeWidth="2" fill="rgba(193, 193, 193, 0.2)" />
                <path d="M 120 20 C 60 60, 60 140, 120 180" stroke="#3A3A3A" strokeWidth="2" fill="none" />

                {/* Rays */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <path 
                        key={i}
                        className="ray"
                        d={`M 0 ${40 + i * 30} L 120 ${40 + i * 30} L 250 100`}
                        stroke="#8A8A8A"
                        strokeWidth="1.5"
                        fill="none"
                        style={{ animationDelay: `${i * 0.2}s` }}
                    />
                ))}
                {/* Focal Point */}
                <circle cx="250" cy="100" r="6" fill="#3A3A3A" />
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                Mental discipline acts like a lens, focusing scattered attention into a coherent point.
            </p>
        </div>
    );
};

export default RefiningMechanismsViz;