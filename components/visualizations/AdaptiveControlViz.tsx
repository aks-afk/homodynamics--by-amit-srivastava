import React from 'react';

const AdaptiveControlViz: React.FC = () => {
    const pathData = "M 0 100 C 50 20, 100 180, 150 120 C 200 60, 250 140, 300 110";

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Adaptive Control System</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                 <style>{`
                    .adaptive-wave {
                        stroke-dasharray: 500;
                        stroke-dashoffset: 500;
                        animation: adapt 8s ease-in-out forwards;
                    }
                    @keyframes adapt {
                       to {
                          stroke-dashoffset: 0;
                          d: path("M 0 100 C 50 110, 100 90, 150 105 C 200 95, 250 102, 300 100");
                       }
                    }
                `}</style>
                {/* Setpoint */}
                <line x1="0" y1="100" x2="300" y2="100" stroke="#C1C1C1" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Adapting Wave */}
                <path className="adaptive-wave" d={pathData} stroke="#3A3A3A" strokeWidth="2" fill="none" />
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                A system that learns and adjusts its parameters over time to achieve stable operation.
            </p>
        </div>
    );
};

export default AdaptiveControlViz;