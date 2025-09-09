import React from 'react';

const OriginatorViz: React.FC = () => {
    const signaturePath = "M 40 120 C 60 80, 110 80, 120 120 C 130 160, 180 160, 190 120 C 200 80, 250 80, 260 120";
    const pathLength = 300; // Estimated length for animation

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>The Originator</h4>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                    <style>{`
                        .signature-path {
                            stroke-dasharray: ${pathLength};
                            stroke-dashoffset: ${pathLength};
                            animation: draw-signature 3s ease-out forwards;
                        }
                        @keyframes draw-signature {
                            to { stroke-dashoffset: 0; }
                        }
                    `}</style>
                    <path
                        className="signature-path"
                        d={signaturePath}
                        stroke="#3A3A3A"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                Created and conceptualized by Amit Srivastava.
            </p>
        </div>
    );
};

export default OriginatorViz;