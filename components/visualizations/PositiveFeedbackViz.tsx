import React from 'react';

const PositiveFeedbackViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Positive Feedback Loop</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                <style>{`
                    .spiral-path {
                        stroke-dasharray: 1000;
                        stroke-dashoffset: 1000;
                        animation: draw-spiral 5s linear infinite;
                    }
                    @keyframes draw-spiral {
                        to { stroke-dashoffset: 0; }
                    }
                `}</style>
                <path 
                    className="spiral-path"
                    d="M150,100 C170,100 170,120 150,120 C130,120 130,80 150,80 C190,80 190,140 150,140 C110,140 110,60 150,60 C210,60 210,160 150,160 C90,160 90,40 150,40" 
                    stroke="#3A3A3A" 
                    strokeWidth="2" 
                    fill="none" 
                />
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                An amplifying loop where small changes lead to larger effects, entrenching suffering.
            </p>
        </div>
    );
};

export default PositiveFeedbackViz;