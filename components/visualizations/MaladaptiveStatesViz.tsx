import React from 'react';

const MaladaptiveStatesViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Feedback Loops & Maladaptive States</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                 <style>{`
                    .pulse { animation: pulse-animation 2s infinite; }
                    @keyframes pulse-animation { 0% { r: 15px; } 50% { r: 18px; } 100% { r: 15px; } }
                `}</style>

                <defs>
                    <marker id="arrow-maladaptive" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#3A3A3A" />
                    </marker>
                </defs>

                {/* Nodes */}
                <circle cx="80" cy="100" r="20" fill="#FCFBF8" stroke="#3A3A3A" strokeWidth="2" />
                <text x="80" y="100" textAnchor="middle" dy=".3em" fontSize="10">Craving</text>

                <circle className="pulse" cx="220" cy="100" r="15" fill="#C1C1C1" stroke="#3A3A3A" strokeWidth="2" />
                <text x="220" y="100" textAnchor="middle" dy=".3em" fontSize="10">Suffering</text>

                {/* Loop */}
                <path d="M 100 100 C 150 60, 200 60, 200 100" stroke="#3A3A3A" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-maladaptive)" />
                <path d="M 200 100 C 200 140, 150 140, 100 100" stroke="#3A3A3A" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-maladaptive)" />
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                Unchecked feedback loops can lock a system into a stable but harmful state.
            </p>
        </div>
    );
};

export default MaladaptiveStatesViz;