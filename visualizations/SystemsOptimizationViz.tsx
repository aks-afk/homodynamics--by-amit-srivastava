import React from 'react';

const SystemsOptimizationViz: React.FC = () => {
    const nodes = [ { x: 50, y: 50 }, { x: 150, y: 30 }, { x: 250, y: 60 }, { x: 70, y: 150 }, { x: 180, y: 160 }, { x: 260, y: 140 } ];
    const links = [ [0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [2, 5], [3, 4], [4, 5] ];

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Modern Systems Optimization</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                {links.map(([source, target], i) => (
                    <line key={i} x1={nodes[source].x} y1={nodes[source].y} x2={nodes[target].x} y2={nodes[target].y} stroke="#C1C1C1" strokeWidth="1.5" />
                ))}
                {nodes.map((node, i) => (
                    <circle key={i} cx={node.x} cy={node.y} r="8" fill="#3A3A3A" />
                ))}
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                Balancing the competing demands of a complex, interconnected modern life.
            </p>
        </div>
    );
};

export default SystemsOptimizationViz;