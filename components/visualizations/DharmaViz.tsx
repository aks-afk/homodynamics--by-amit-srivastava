import React from 'react';

const Gear = ({ cx, cy, radius, teeth, rotation, speed }: { cx: number, cy: number, radius: number, teeth: number, rotation: number, speed: number }) => {
    const pathData = Array.from({ length: teeth * 2 }, (_, i) => {
        const angle = (i / (teeth * 2)) * 2 * Math.PI;
        const r = radius * (i % 2 === 0 ? 1 : 0.8);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ') + ' Z';

    return (
        <g style={{ animation: `spin ${speed}s linear infinite`, transformOrigin: `${cx}px ${cy}px` }}>
            <path d={pathData} fill="#8A8A8A" stroke="#3A3A3A" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r={radius * 0.2} fill="#FCFBF8" stroke="#3A3A3A" strokeWidth="1.5" />
        </g>
    );
};

const DharmaViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Dharma: Righteousness & Order</h4>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 300 200">
                    <style>{`
                        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                        @keyframes spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
                    `}</style>
                    <g style={{ animation: 'spin 10s linear infinite', transformOrigin: '100px 100px' }}>
                        <Gear cx={100} cy={100} radius={50} teeth={10} rotation={0} speed={10} />
                    </g>
                     <g style={{ animation: 'spin-reverse 6s linear infinite', transformOrigin: '187px 100px' }}>
                         <Gear cx={187} cy={100} radius={30} teeth={6} rotation={0} speed={6} />
                    </g>
                </svg>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                The harmonious functioning of personal duty and cosmic order.
            </p>
        </div>
    );
};

export default DharmaViz;