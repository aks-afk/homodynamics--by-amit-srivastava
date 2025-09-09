import React from 'react';

const Gear = ({ cx, cy, radius, teeth, style }: { cx: number, cy: number, radius: number, teeth: number, style?: React.CSSProperties }) => {
    const pathData = Array.from({ length: teeth * 2 }, (_, i) => {
        const angle = (i / (teeth * 2)) * 2 * Math.PI;
        const r = radius * (i % 2 === 0 ? 1 : 0.85);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ') + ' Z';
    return (
        <g style={style}>
            <path d={pathData} fill="#8A8A8A" stroke="#3A3A3A" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r={radius * 0.2} fill="#FCFBF8" stroke="#3A3A3A" strokeWidth="1.5" />
        </g>
    );
};

const InteractingSystemsViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Interacting Systems</h4>
            <svg viewBox="0 0 300 200">
                <style>{`
                    .g1 { animation: spin 10s linear infinite; transform-origin: 150px 70px; }
                    .g2 { animation: spin-reverse 6s linear infinite; transform-origin: 105px 140px; }
                    .g3 { animation: spin-reverse 8s linear infinite; transform-origin: 195px 140px; }
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
                `}</style>
                <Gear cx={150} cy={70} radius={40} teeth={8} style={{ animation: 'spin 10s linear infinite', transformOrigin: '150px 70px' }} />
                <Gear cx={105} cy={140} radius={25} teeth={5} style={{ animation: 'spin-reverse 6s linear infinite', transformOrigin: '105px 140px' }} />
                <Gear cx={195} cy={140} radius={30} teeth={6} style={{ animation: 'spin-reverse 8s linear infinite', transformOrigin: '195px 140px' }} />
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                The health of the whole depends on the harmonious, balanced interaction of its parts.
            </p>
        </div>
    );
};

export default InteractingSystemsViz;