import React from 'react';

const ArthaViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Artha: Wealth & Resources</h4>
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 300 220">
                    <style>{`
                        .trunk { height: 100px; animation: grow-trunk 2s ease-out forwards; }
                        .leaves { transform: scale(0); animation: grow-leaves 2s 1.5s ease-out forwards; }
                        .fruit { opacity: 0; animation: appear 1s 3s forwards; }
                        @keyframes grow-trunk { from { height: 0px; } to { height: 100px; } }
                        @keyframes grow-leaves { from { transform: scale(0); } to { transform: scale(1); } }
                        @keyframes appear { to { opacity: 1; } }
                    `}</style>
                    {/* Ground */}
                    <path d="M 50 200 H 250" stroke="#C1C1C1" strokeWidth="2" />

                    {/* Tree */}
                    <g>
                        {/* Trunk */}
                        <rect x="145" y="100" width="10" rx="3" fill="#8A8A8A">
                           <animate attributeName="height" from="0" to="100" dur="2s" fill="freeze" />
                           <animate attributeName="y" from="200" to="100" dur="2s" fill="freeze" />
                        </rect>
                        {/* Leaves */}
                        <g className="leaves" style={{transformOrigin: '150px 100px'}}>
                            <circle cx="150" cy="70" r="50" fill="#5A5A5A" opacity="0.3" />
                            <circle cx="120" cy="80" r="40" fill="#5A5A5A" opacity="0.4" />
                            <circle cx="180" cy="80" r="40" fill="#5A5A5A" opacity="0.4" />
                        </g>
                        {/* Fruit */}
                        <g className="fruit">
                            <circle cx="110" cy="90" r="6" fill="#3A3A3A" />
                            <circle cx="150" cy="50" r="6" fill="#3A3A3A" />
                            <circle cx="190" cy="90" r="6" fill="#3A3A3A" />
                            <circle cx="130" cy="110" r="6" fill="#3A3A3A" />
                             <circle cx="170" cy="65" r="6" fill="#3A3A3A" />
                        </g>
                    </g>
                </svg>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                The growth of material prosperity and security.
            </p>
        </div>
    );
};

export default ArthaViz;