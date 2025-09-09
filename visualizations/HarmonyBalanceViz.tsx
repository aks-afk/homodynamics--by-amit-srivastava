import React from 'react';

const HarmonyBalanceViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Harmony as Dynamic Balance</h4>
            <svg viewBox="0 0 300 250" style={{ width: '100%', height: 'auto' }}>
                <style>{`
                    .mobile-arm { animation: gentle-sway 8s ease-in-out infinite alternate; transform-origin: center; }
                    @keyframes gentle-sway {
                        from { transform: rotate(-3deg); }
                        to { transform: rotate(3deg); }
                    }
                `}</style>
                {/* Main structure */}
                <line x1="150" y1="20" x2="150" y2="50" stroke="#3A3A3A" strokeWidth="1.5" />
                <g className="mobile-arm">
                    <line x1="70" y1="50" x2="230" y2="50" stroke="#3A3A3A" strokeWidth="1.5" />
                    <line x1="70" y1="50" x2="70" y2="100" stroke="#3A3A3A" strokeWidth="1.5" />
                    <line x1="230" y1="50" x2="230" y2="80" stroke="#3A3A3A" strokeWidth="1.5" />
                    <line x1="150" y1="50" x2="150" y2="120" stroke="#3A3A3A" strokeWidth="1.5" />

                    {/* Shapes */}
                    <circle cx="150" cy="140" r="20" fill="#FCFBF8" stroke="#3A3A3A" strokeWidth="2" />
                    <text x="150" y="140" textAnchor="middle" dy=".3em" fontSize="10">Reason</text>

                    <rect x="55" y="100" width="30" height="30" fill="#FCFBF8" stroke="#3A3A3A" strokeWidth="2" />
                    <text x="70" y="115" textAnchor="middle" dy=".3em" fontSize="10">Spirit</text>

                    <polygon points="230,80 210,110 250,110" fill="#FCFBF8" stroke="#3A3A3A" strokeWidth="2" />
                    <text x="230" y="100" textAnchor="middle" dy=".3em" fontSize="10">Appetite</text>
                </g>
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                A well-ordered soul is not static, but a constant, harmonious negotiation between its parts.
            </p>
        </div>
    );
};

export default HarmonyBalanceViz;