import React from 'react';

const StockAndFlowViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Stock-and-Flow Models</h4>
            <svg viewBox="0 0 300 200">
                <style>{`
                    .flow-particle { animation: flow 4s linear infinite; }
                    @keyframes flow {
                        from { offset-distance: 0%; }
                        to { offset-distance: 100%; }
                    }
                `}</style>
                {/* Pipes */}
                <path id="in-flow" d="M 0 80 H 80" stroke="#3A3A3A" strokeWidth="10" fill="none" />
                <path id="out-flow" d="M 220 120 H 300" stroke="#3A3A3A" strokeWidth="10" fill="none" />
                
                {/* Stock */}
                <rect x="80" y="50" width="140" height="100" fill="rgba(138, 138, 138, 0.3)" stroke="#3A3A3A" strokeWidth="2" />
                <text x="150" y="105" textAnchor="middle" fontSize="16" fontWeight="bold">STOCK</text>

                {/* Particles */}
                <circle r="4" fill="#5A5A5A" className="flow-particle">
                    <animateMotion dur="4s" repeatCount="indefinite"><mpath href="#in-flow" /></animateMotion>
                </circle>
                <circle r="4" fill="#8A8A8A" className="flow-particle">
                    <animateMotion dur="4s" repeatCount="indefinite"><mpath href="#out-flow" /></animateMotion>
                </circle>
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                Modeling dynamic systems by tracking accumulations (stocks) and rates of change (flows).
            </p>
        </div>
    );
};

export default StockAndFlowViz;