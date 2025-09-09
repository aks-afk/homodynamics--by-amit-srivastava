import React from 'react';

const IntroductionFeedbackViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Dissipative Systems</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                 <style>{`
                    @keyframes flow-in {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100px); opacity: 0; }
                    }
                     @keyframes flow-out {
                        from { transform: translateX(200px); opacity: 0; }
                        to { transform: translateX(300px); opacity: 1; }
                    }
                `}</style>
                {/* System Boundary */}
                <rect x="100" y="50" width="100" height="100" rx="10" fill="rgba(193, 193, 193, 0.2)" stroke="#C1C1C1" strokeDasharray="5 3" />

                {/* Internal Structure */}
                <circle cx="150" cy="100" r="20" fill="#3A3A3A" />

                {/* Flowing Particles */}
                <g>
                    <circle cx="0" cy="80" r="3" fill="#8A8A8A" style={{ animation: 'flow-in 2s linear infinite' }} />
                    <circle cx="0" cy="120" r="3" fill="#8A8A8A" style={{ animation: 'flow-in 2s 1s linear infinite' }} />
                    <circle cx="200" cy="70" r="3" fill="#5A5A5A" style={{ animation: 'flow-out 2s 0.5s linear infinite' }} />
                    <circle cx="200" cy="130" r="3" fill="#5A5A5A" style={{ animation: 'flow-out 2s 1.5s linear infinite' }} />
                </g>
                <text x="50" y="40" textAnchor="middle" fontSize="12">Energy In</text>
                <text x="250" y="40" textAnchor="middle" fontSize="12">Energy Out</text>
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                Living systems maintain order by exchanging energy with their environment via feedback loops.
            </p>
        </div>
    );
};

export default IntroductionFeedbackViz;