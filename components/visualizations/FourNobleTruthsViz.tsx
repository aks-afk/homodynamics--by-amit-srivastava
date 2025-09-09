import React, { useState } from 'react';

const FourNobleTruthsViz: React.FC = () => {
    const [mindfulness, setMindfulness] = useState(false);

    const Node = ({ x, y, label, r = 35 }: { x: number, y: number, label: string, r?: number }) => {
        // Simple logic to split long words for this specific viz
        const labelParts = (label === "Mindfulness") ? ["Mindful-", "ness"] : [label];
        
        return (
            <g>
                <path 
                    d={`M ${x} ${y-r} C ${x+r} ${y-r}, ${x+r} ${y+r}, ${x} ${y+r} C ${x-r} ${y+r}, ${x-r} ${y-r}, ${x} ${y-r} Z`}
                    fill="#FCFBF8" 
                    stroke="#8A8A8A" 
                    strokeWidth="1.5"
                    transform={`rotate(30 ${x} ${y})`}
                 />
                <text x={x} y={y} textAnchor="middle" dy={labelParts.length > 1 ? "-0.1em" : ".3em"} fontSize="10" fill="#3A3A3A" fontWeight="500" style={{ pointerEvents: 'none' }}>
                    {labelParts.map((part, i) => (
                        <tspan key={i} x={x} dy={i > 0 ? "1.2em" : 0}>{part}</tspan>
                    ))}
                </text>
            </g>
        );
    };

    const Arrow = ({ fromX, fromY, toX, toY, label, curved = false, color = '#5A5A5A' }: { fromX: number, fromY: number, toX: number, toY: number, label: string, curved?: boolean, color?: string }) => {
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const endX = toX - 37 * Math.cos(angle);
        const endY = toY - 37 * Math.sin(angle);
        const startX = fromX + 37 * Math.cos(angle);
        const startY = fromY + 37 * Math.sin(angle);
        
        const path = curved 
          ? `M ${startX},${startY} C ${(startX + toX)/2},${startY - 80} ${(startX + toX)/2},${toY - 80} ${endX},${endY}`
          : `M ${startX},${startY} L ${endX},${endY}`;
        
        const labelOffset = curved ? -40 : -10;
        const textX = (startX + endX) / 2 + (curved ? 0 : 10 * Math.sin(angle));
        const textY = (startY + endY) / 2 + (curved ? labelOffset : -10 * Math.cos(angle));

        return (
            <g>
                <defs>
                    <marker id={`arrowhead-${color.replace('#', '')}`} markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill={color} />
                    </marker>
                </defs>
                <path d={path} stroke={color} strokeWidth="1" fill="none" markerEnd={`url(#arrowhead-${color.replace('#', '')})`} />
                <text x={textX} y={textY} textAnchor="middle" fontSize="11" fill={color}>{label}</text>
            </g>
        );
    };
    
    const buttonStyle: React.CSSProperties = {
        display: 'block',
        width: '100%',
        padding: '0.75rem',
        fontSize: '1rem',
        cursor: 'pointer',
        background: mindfulness ? '#F1F0EC' : '#FCFBF8',
        color: '#3A3A3A',
        border: '1px solid #C1C1C1',
        borderRadius: '4px',
        fontFamily: 'Georgia, serif',
        marginTop: '1rem',
        transition: 'background 0.2s ease',
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>The Cycle of Suffering</h4>
            <svg viewBox="0 0 300 250" style={{ width: '100%', height: 'auto' }}>
                <Node x={150} y={50} label="Suffering" />
                <Node x={50} y={150} label="Craving" />
                <Node x={250} y={150} label="Ignorance" />

                <Arrow fromX={50} fromY={150} toX={150} toY={50} label="causes" />
                <Arrow fromX={250} fromY={150} toX={150} toY={50} label="causes" />
                <Arrow fromX={150} fromY={50} toX={50} toY={150} label="reinforces" curved />

                <g opacity={mindfulness ? 1 : 0} style={{ transition: 'opacity 0.5s' }}>
                    <Node x={150} y={200} label="Mindfulness" r={30}/>
                    <Arrow fromX={150} fromY={200} toX={50} toY={150} label="breaks cycle" color="#8A8A8A" />
                </g>
            </svg>
            <button 
                onClick={() => setMindfulness(!mindfulness)}
                style={buttonStyle}
            >
                {mindfulness ? 'Release Practice' : 'Practice Mindfulness'}
            </button>
        </div>
    );
};

export default FourNobleTruthsViz;