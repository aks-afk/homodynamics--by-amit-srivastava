import React, { useState } from 'react';

const ThreeComponentsViz: React.FC = () => {
    const [hovered, setHovered] = useState<string | null>(null);
    const size = 300;
    const center = size / 2;
    const radius = size / 3.5;

    const points = [
        { id: 'bio', label: 'Biological', x: center, y: center - radius, color: '#3A3A3A' },
        { id: 'logic', label: 'Logical', x: center - radius * Math.cos(Math.PI / 6), y: center + radius * Math.sin(Math.PI / 6), color: '#8A8A8A' },
        { id: 'intellect', label: 'Intellectual', x: center + radius * Math.cos(Math.PI / 6), y: center + radius * Math.sin(Math.PI / 6), color: '#5A5A5A' },
    ];

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>The Three Components</h4>
            <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', height: 'auto' }}>
                <defs>
                    <filter id="glow-subtle" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Lines */}
                <line x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} stroke="#C1C1C1" strokeWidth="1" />
                <line x1={points[1].x} y1={points[1].y} x2={points[2].x} y2={points[2].y} stroke="#C1C1C1" strokeWidth="1" />
                <line x1={points[2].x} y1={points[2].y} x2={points[0].x} y2={points[0].y} stroke="#C1C1C1" strokeWidth="1" />
                
                {/* Center text */}
                 <text x={center} y={center} textAnchor="middle" dy=".3em" fontSize="16" fill="#3A3A3A" fontWeight="bold">
                    Equilibrium
                </text>

                {/* Nodes */}
                {points.map(p => (
                    <g key={p.id} onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)} style={{cursor: 'default'}}>
                        <circle
                            cx={p.x}
                            cy={p.y}
                            fill={p.color}
                            style={{ transition: 'r 0.2s ease' }}
                            r={hovered === p.id ? 18 : 15}
                            filter={hovered === p.id ? 'url(#glow-subtle)' : 'none'}
                        />
                         <text 
                            x={p.x} 
                            y={p.y + (p.id === 'bio' ? -35 : 35)} // Adjust label position
                            textAnchor="middle" 
                            dy=".3em" 
                            fontSize="13" 
                            fill="#3A3A3A" 
                            style={{ pointerEvents: 'none', transition: 'opacity 0.2s', opacity: hovered === p.id ? 1 : 0.7 }}
                        >
                            {p.label}
                        </text>
                    </g>
                ))}
            </svg>
             <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>A triad of human motion, their harmony creates equilibrium.</p>
        </div>
    );
};

export default ThreeComponentsViz;