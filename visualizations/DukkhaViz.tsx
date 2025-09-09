import React from 'react';

const DukkhaViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Dukkha: Systemic Disequilibrium</h4>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                    <style>{`
                        @keyframes roll {
                            to { transform: translateX(50px) rotate(360deg); }
                        }
                        @keyframes bump {
                            0%, 100% { transform: translateY(0); }
                            25% { transform: translateY(5px); }
                            75% { transform: translateY(-5px); }
                        }
                    `}</style>
                    {/* Ground */}
                    <line x1="0" y1="160" x2="300" y2="160" stroke="#C1C1C1" strokeWidth="2" />
                    
                    {/* Cart Body */}
                    <g style={{ animation: 'bump 1s linear infinite' }}>
                        <rect x="100" y="100" width="80" height="40" fill="#FCFBF8" stroke="#5A5A5A" strokeWidth="1.5" />
                        
                        {/* Wheel */}
                        <g style={{ animation: 'roll 1s linear infinite', transformOrigin: '140px 145px' }}>
                            <circle cx="140" cy="145" r="15" fill="#8A8A8A" stroke="#3A3A3A" strokeWidth="1.5" />
                            {/* Axle off-center */}
                            <circle cx="143" cy="142" r="3" fill="#3A3A3A" />
                        </g>
                    </g>
                </svg>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                The perpetual friction and dissatisfaction of a system misaligned with reality.
            </p>
        </div>
    );
};

export default DukkhaViz;