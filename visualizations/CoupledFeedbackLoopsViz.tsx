import React from 'react';

const CoupledFeedbackLoopsViz: React.FC = () => {
    const size = 300;
    const center = size / 2;
    const radius = size / 3;
    const nodes = {
        reason: { x: center, y: center - radius },
        spirit: { x: center - radius * 0.866, y: center + radius * 0.5 },
        appetite: { x: center + radius * 0.866, y: center + radius * 0.5 },
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Coupled Feedback Loops</h4>
            <svg viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    <marker id="arrow-coupled" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#5A5A5A" />
                    </marker>
                </defs>

                {/* Paths */}
                <path d={`M ${nodes.reason.x+12} ${nodes.reason.y+12} Q ${center-40}, ${center-40}, ${nodes.spirit.x+12} ${nodes.spirit.y-12}`} stroke="#5A5A5A" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-coupled)" />
                <path d={`M ${nodes.spirit.x+10} ${nodes.spirit.y+10} Q ${center}, ${center+60}, ${nodes.appetite.x-10} ${nodes.appetite.y+10}`} stroke="#5A5A5A" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-coupled)" />
                <path d={`M ${nodes.appetite.x-12} ${nodes.appetite.y-12} Q ${center+40}, ${center-40}, ${nodes.reason.x-12} ${nodes.reason.y+12}`} stroke="#5A5A5A" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-coupled)" />

                {/* Nodes */}
                {Object.entries(nodes).map(([key, pos]) => (
                    <g key={key}>
                        <circle cx={pos.x} cy={pos.y} r="20" fill="#FCFBF8" stroke="#3A3A3A" strokeWidth="2" />
                        <text x={pos.x} y={pos.y} textAnchor="middle" dy=".3em" fontSize="10" fill="#3A3A3A" style={{ textTransform: 'capitalize' }}>{key}</text>
                    </g>
                ))}
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                The parts of the soul constantly influence one another in a dynamic regulatory network.
            </p>
        </div>
    );
};

export default CoupledFeedbackLoopsViz;