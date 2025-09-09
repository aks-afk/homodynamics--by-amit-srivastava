import React from 'react';

const OrderAndChaosViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Poised Between Order & Chaos</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                 <style>{`
                    .morph-path { animation: morph 10s ease-in-out infinite alternate; }
                    @keyframes morph {
                        0% { d: path("M 150 20 L 220 70 L 180 150 L 120 150 L 80 70 Z"); } /* Crystal */
                        50% { d: path("M 150 20 C 250 20, 250 180, 150 180 C 50 180, 50 20, 150 20 Z"); } /* Fluid */
                        100% { d: path("M 150 20 L 220 70 L 180 150 L 120 150 L 80 70 Z"); } /* Crystal */
                    }
                `}</style>
                <path className="morph-path" fill="rgba(138, 138, 138, 0.3)" stroke="#3A3A3A" strokeWidth="2" />
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                Life thrives at the creative boundary between rigid stability and complete disorder.
            </p>
        </div>
    );
};

export default OrderAndChaosViz;