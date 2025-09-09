import React from 'react';

const WisdomPillarViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Pillar: Wisdom</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                 <style>{`
                    .pupil { animation: look-around 10s ease-in-out infinite; transform-origin: center; }
                    @keyframes look-around {
                        0%, 100% { transform: translate(0, 0); }
                        25% { transform: translate(5px, -3px); }
                        50% { transform: translate(0, 5px); }
                        75% { transform: translate(-5px, 0); }
                    }
                `}</style>
                {/* Eye shape */}
                <path d="M 50 100 C 100 50, 200 50, 250 100 C 200 150, 100 150, 50 100 Z" fill="#FCFBF8" stroke="#3A3A3A" strokeWidth="2" />
                {/* Iris */}
                <circle cx="150" cy="100" r="30" fill="#8A8A8A" />
                {/* Pupil */}
                <circle className="pupil" cx="150" cy="100" r="15" fill="#3A3A3A" />
                {/* Reflection */}
                <circle cx="160" cy="90" r="5" fill="white" opacity="0.7" />
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                Establishing an accurate system model through Right View and Right Intention.
            </p>
        </div>
    );
};

export default WisdomPillarViz;