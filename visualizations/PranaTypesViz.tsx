import React from 'react';

const PranaTypesViz: React.FC = () => {
    const arrows = [
        { type: 'Prāṇa', d: "M 150 80 L 150 40", x: 150, y: 30 }, // Inward/Up
        { type: 'Apāna', d: "M 150 120 L 150 160", x: 150, y: 170 }, // Downward
        { type: 'Vyāna', d: "M 120 100 L 80 100", x: 70, y: 100 }, // Outward
        { type: 'Udāna', d: "M 180 100 L 220 100", x: 230, y: 100 }, // Outward
        { type: 'Samāna', d: "M 130 100 A 20 20 0 1 1 170 100", x: 150, y: 100, isCircle: true }, // Circular
    ];

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>The Five Vayus (Winds)</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                <defs>
                    <marker id="arrow-prana" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#3A3A3A" />
                    </marker>
                </defs>
                
                {/* Center */}
                <circle cx="150" cy="100" r="30" fill="rgba(193, 193, 193, 0.2)" />

                {arrows.map(a => (
                    <g key={a.type}>
                         <path d={a.d} stroke="#3A3A3A" strokeWidth="2" fill="none" markerEnd={a.isCircle ? "" : "url(#arrow-prana)"} />
                         <text x={a.x} y={a.y} textAnchor="middle" fontSize="11" dy={a.type === 'Apāna' ? 5 : 0}>{a.type}</text>
                    </g>
                ))}
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                The different types of Prāṇa govern specific physiological functions and energy flows.
            </p>
        </div>
    );
};

export default PranaTypesViz;