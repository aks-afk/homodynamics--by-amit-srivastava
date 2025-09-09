import React from 'react';

const MultidimensionalOptimizationViz: React.FC = () => {
    const size = 300;
    const center = size / 2;
    const radius = size / 2.5;
    const points = `
        ${center},${center-radius*0.7} 
        ${center+radius*0.8},${center} 
        ${center},${center+radius*0.6} 
        ${center-radius*0.9},${center}
    `;

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Multidimensional Optimization</h4>
            <svg viewBox={`0 0 ${size} ${size}`}>
                {/* Axes */}
                <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="#C1C1C1" strokeWidth="1" />
                <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="#C1C1C1" strokeWidth="1" />

                {/* Area */}
                <polygon points={points} fill="rgba(58, 58, 58, 0.3)" stroke="#3A3A3A" strokeWidth="2" />
                
                {/* Labels */}
                <text x={center} y={center - radius - 5} textAnchor="middle" fontSize="12">Dharma</text>
                <text x={center + radius + 15} y={center + 4} textAnchor="middle" fontSize="12">Artha</text>
                <text x={center} y={center + radius + 15} textAnchor="middle" fontSize="12">Kāma</text>
                <text x={center - radius - 20} y={center + 4} textAnchor="middle" fontSize="12">Mokṣa</text>
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                Navigating the complex trade-offs between life's competing but essential goals.
            </p>
        </div>
    );
};

export default MultidimensionalOptimizationViz;