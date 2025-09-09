import React from 'react';

const IntroductionLifeViz: React.FC = () => {
    const pathData = "M 0 100 Q 75 20, 150 100 T 300 100";
    
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Life as Dynamic Equilibrium</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                <style>{`
                    .wave {
                        stroke-dasharray: 420;
                        stroke-dashoffset: 420;
                        animation: draw-wave 4s linear infinite;
                    }
                    @keyframes draw-wave {
                        to {
                            stroke-dashoffset: 0;
                        }
                    }
                `}</style>
                {/* Stable Center Line */}
                <line x1="0" y1="100" x2="300" y2="100" stroke="#C1C1C1" strokeWidth="1.5" strokeDasharray="4 4" />
                
                {/* Animated Wave */}
                <path className="wave" d={pathData} stroke="#5A5A5A" strokeWidth="2.5" fill="none" />
                
                {/* Center Point */}
                <circle cx="150" cy="100" r="6" fill="#3A3A3A" />
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                A continuous dance of stability maintained through constant change and adaptation.
            </p>
        </div>
    );
};

export default IntroductionLifeViz;