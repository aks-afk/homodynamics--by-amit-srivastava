import React, { useEffect, useRef, useState } from 'react';

const ThreeDimensionsViz: React.FC = () => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    // FIX: Initialize useRef with null to satisfy the "Expected 1 arguments" error.
    const requestRef = useRef<number | null>(null);

    const size = 60;
    const points = [
        { x: -size, y: -size, z: -size }, { x: size, y: -size, z: -size },
        { x: size, y: size, z: -size }, { x: -size, y: size, z: -size },
        { x: -size, y: -size, z: size }, { x: size, y: -size, z: size },
        { x: size, y: size, z: size }, { x: -size, y: size, z: size }
    ];

    const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    const project = (point: {x:number, y:number, z:number}, rot: {x:number, y:number}) => {
        const { x, y, z } = point;
        const sinX = Math.sin(rot.x); const cosX = Math.cos(rot.x);
        const sinY = Math.sin(rot.y); const cosY = Math.cos(rot.y);

        const rotatedX = cosY * x + sinY * z;
        const rotatedZ = -sinY * x + cosY * z;
        const rotatedY = cosX * y - sinX * rotatedZ;
        
        const perspective = 300 / (300 + rotatedZ + size);
        return { x: rotatedX * perspective + 150, y: rotatedY * perspective + 150 };
    };

    const animate = () => {
        setRotation(prev => ({ x: prev.x + 0.005, y: prev.y + 0.005 }));
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    const projectedPoints = points.map(p => project(p, rotation));

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>The Three Dimensions</h4>
            <svg viewBox="0 0 300 300" style={{ width: '100%', height: 'auto' }}>
                <g>
                    {edges.map(([i, j], index) => (
                        <line
                            key={index}
                            x1={projectedPoints[i].x} y1={projectedPoints[i].y}
                            x2={projectedPoints[j].x} y2={projectedPoints[j].y}
                            stroke="#3A3A3A" strokeWidth="1.5"
                        />
                    ))}
                </g>
                <text x="150" y="30" textAnchor="middle" fill="#5A5A5A" fontSize="14" fontFamily="Georgia">Energy</text>
                <text x="260" y="150" textAnchor="middle" fill="#5A5A5A" fontSize="14" fontFamily="Georgia">Space</text>
                <text x="150" y="270" textAnchor="middle" fill="#5A5A5A" fontSize="14" fontFamily="Georgia">Time</text>
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>Life unfolds across Energy, Space, and Time.</p>
        </div>
    );
};

export default ThreeDimensionsViz;