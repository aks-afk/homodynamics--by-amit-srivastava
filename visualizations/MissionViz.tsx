import React, { useEffect, useState } from 'react';

const MissionViz: React.FC = () => {
    const points = ['Bridge', 'Accessible', 'Growth', 'Integrate'];
    const [activePoint, setActivePoint] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActivePoint(prev => (prev + 1) % points.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const getRotation = (index: number) => {
        return index * 90;
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Purpose & Mission</h4>
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 200 200" style={{ width: '100%', height: 'auto' }}>
                    {/* Compass Rose */}
                    <circle cx="100" cy="100" r="80" fill="#FCFBF8" stroke="#C1C1C1" />
                    {['N', 'E', 'S', 'W'].map((dir, i) => (
                        <g key={dir}>
                            <line x1="100" y1="100" x2="100" y2="25" stroke="#EAE8E1" transform={`rotate(${i * 90} 100 100)`} />
                             <text x="100" y="18" textAnchor="middle" fontSize="10" fill="#8A8A8A" transform={`rotate(${i * 90} 100 100)`}>
                                 {points[i]}
                             </text>
                        </g>
                    ))}

                    {/* Needle */}
                    <g style={{ transform: `rotate(${getRotation(activePoint)}deg)`, transition: 'transform 1s ease-in-out', transformOrigin: 'center' }}>
                        <polygon points="100,25 105,100 100,105 95,100" fill="#3A3A3A" />
                        <polygon points="100,175 105,100 100,95 95,100" fill="#8A8A8A" />
                        <circle cx="100" cy="100" r="5" fill="#FCFBF8" stroke="#3A3A3A" />
                    </g>
                </svg>
            </div>
             <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                Guiding principles for integrative thinking.
            </p>
        </div>
    );
};

export default MissionViz;