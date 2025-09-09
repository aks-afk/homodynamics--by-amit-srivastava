import React from 'react';

const IntroductionMergeViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Merging Two Worlds</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                <g opacity="0.7">
                    <circle cx="110" cy="100" r="70" fill="#8A8A8A" />
                    <circle cx="190" cy="100" r="70" fill="#5A5A5A" />
                </g>
                <text y="95" x="110" fill="white" fontSize="14" textAnchor="middle">
                    <tspan>Ancient</tspan>
                    <tspan x="110" dy="1.2em">Wisdom</tspan>
                </text>
                <text y="95" x="190" fill="white" fontSize="14" textAnchor="middle">
                    <tspan>Modern</tspan>
                    <tspan x="190" dy="1.2em">Physics</tspan>
                </text>
                <text x="150" y="105" fill="#3A3A3A" fontSize="16" fontWeight="bold" textAnchor="middle">Homodynamics</text>
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                Homodynamics as the synthesis of ancient philosophy and contemporary science.
            </p>
        </div>
    );
};

export default IntroductionMergeViz;