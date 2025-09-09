import React from 'react';

const ContinuousRegulationViz: React.FC = () => {
    const path = "M 0 100 C 50 50, 100 150, 150 100 S 250 50, 300 100";
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Continuous Regulation</h4>
            <svg viewBox="0 0 300 200">
                <style>{`
                    .tracer { animation: trace-path 5s linear infinite; }
                    @keyframes trace-path { from { motion-offset: 0%; } to { motion-offset: 100%; } }
                `}</style>
                {/* Setpoint */}
                <line x1="0" y1="100" x2="300" y2="100" stroke="#C1C1C1" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="15" y="90" fontSize="12">Setpoint</text>
                
                {/* Oscillating Path */}
                <path id="regulation-path" d={path} stroke="#5A5A5A" strokeWidth="2" fill="none" />
                
                {/* Tracer */}
                <circle className="tracer" r="5" fill="#3A3A3A">
                    <animateMotion dur="5s" repeatCount="indefinite">
                        <mpath href="#regulation-path" />
                    </animateMotion>
                </circle>
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                Feedback loops constantly adjust the system to maintain stability around a desired state.
            </p>
        </div>
    );
};

export default ContinuousRegulationViz;