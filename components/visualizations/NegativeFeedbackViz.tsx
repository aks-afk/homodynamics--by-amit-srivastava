import React from 'react';

const NegativeFeedbackViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Negative Feedback Loop</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                 <style>{`
                    .dampen-path {
                        stroke-dasharray: 1000;
                        stroke-dashoffset: 0;
                        animation: dampen-spiral 5s linear infinite;
                    }
                    @keyframes dampen-spiral {
                        from { stroke-dashoffset: 0; }
                        to { stroke-dashoffset: 1000; }
                    }
                `}</style>
                <path 
                    className="dampen-path"
                    d="M150,40 C90,40 90,160 150,160 C210,160 210,60 150,60 C110,60 110,140 150,140 C190,140 190,80 150,80 C130,80 130,120 150,120 C170,120 170,100 150,100"
                    stroke="#3A3A3A" 
                    strokeWidth="2" 
                    fill="none" 
                />
                <circle cx="150" cy="100" r="5" fill="#3A3A3A" />
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                A stabilizing loop that counteracts deviations to return the system to equilibrium.
            </p>
        </div>
    );
};

export default NegativeFeedbackViz;