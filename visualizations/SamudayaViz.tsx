import React from 'react';

const SamudayaViz: React.FC = () => {
    const vinePath = "M 150 200 C 100 150, 200 150, 150 100 S 100 50, 150 0";
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Samudaya: The Origin of Suffering</h4>
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 300 250" style={{ width: '100%', height: 'auto' }}>
                    <style>{`
                        .vine-path {
                            stroke-dasharray: 500;
                            stroke-dashoffset: 500;
                            animation: draw-vine 4s ease-out forwards infinite;
                        }
                        @keyframes draw-vine {
                            to { stroke-dashoffset: 0; }
                        }
                    `}</style>
                    {/* Roots - Ignorance */}
                    <text x="150" y="240" textAnchor="middle" fill="#5A5A5A" fontSize="12">Ignorance</text>
                    <path d="M 120 220 C 130 230, 140 210, 150 220 S 170 230, 180 220" stroke="#8A8A8A" strokeWidth="2" fill="none" />
                    
                    {/* The Self */}
                    <circle cx="150" cy="110" r="25" fill="#F1F0EC" stroke="#3A3A3A" strokeWidth="2" />
                    <text x="150" y="115" textAnchor="middle" fill="#3A3A3A" fontSize="14">Self</text>

                    {/* Vines - Craving */}
                    <g transform="translate(0, 10)">
                      <path className="vine-path" d="M 150 210 C 100 180, 200 150, 150 135" stroke="#5A5A5A" strokeWidth="2.5" fill="none" />
                    </g>
                    <g transform="rotate(30 150 110) scale(0.8) translate(10, 20)">
                       <path className="vine-path" d="M 150 210 C 120 180, 180 150, 150 135" stroke="#5A5A5A" strokeWidth="2.5" fill="none" style={{animationDelay: '1s'}} />
                    </g>
                     <g transform="rotate(-30 150 110) scale(0.9) translate(-5, 15)">
                       <path className="vine-path" d="M 150 210 C 130 180, 170 150, 150 135" stroke="#5A5A5A" strokeWidth="2.5" fill="none" style={{animationDelay: '2s'}} />
                    </g>
                </svg>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '0.5rem' }}>
                Craving, born from ignorance, entangles the self.
            </p>
        </div>
    );
};

export default SamudayaViz;