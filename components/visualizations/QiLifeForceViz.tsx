import React from 'react';

const QiLifeForceViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Qì as Fundamental Life Force</h4>
            <svg viewBox="0 0 300 250" style={{ width: '100%', height: 'auto' }}>
                 <style>{`
                    .meridian {
                        stroke-dasharray: 200;
                        stroke-dashoffset: 200;
                        animation: flow-qi 4s ease-in-out infinite alternate;
                    }
                    @keyframes flow-qi {
                        to { stroke-dashoffset: 0; }
                    }
                `}</style>

                {/* Body Outline */}
                <path d="M 150 30 C 120 30, 110 50, 110 80 S 120 120, 120 160 S 130 220, 150 220 S 170 220, 180 160 S 190 120, 190 80 S 180 30, 150 30 Z" 
                      fill="none" stroke="#C1C1C1" strokeWidth="2" />

                {/* Meridians */}
                <path className="meridian" d="M 150 35 C 150 80, 130 120, 130 180" fill="none" stroke="#3A3A3A" strokeWidth="1.5" />
                <path className="meridian" d="M 150 35 C 150 80, 170 120, 170 180" fill="none" stroke="#3A3A3A" strokeWidth="1.5" style={{ animationDelay: '0.5s' }}/>
                <path className="meridian" d="M 115 80 C 130 120, 170 120, 185 80" fill="none" stroke="#5A5A5A" strokeWidth="1.5" style={{ animationDelay: '1s' }} />

            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                The circulation of vital energy through the body's network of channels.
            </p>
        </div>
    );
};

export default QiLifeForceViz;