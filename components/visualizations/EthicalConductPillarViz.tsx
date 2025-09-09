import React from 'react';

const EthicalConductPillarViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Pillar: Ethical Conduct</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                <defs>
                    <path id="circle-path" d="M 150,100 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0" />
                </defs>
                <circle cx="150" cy="100" r="60" fill="none" stroke="#C1C1C1" strokeDasharray="4 4" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <circle key={i} r="10" fill="#5A5A5A">
                        <animateMotion dur="10s" repeatCount="indefinite" rotate="auto">
                            <mpath href="#circle-path"/>
                            <animate attributeName="r" values="10;12;10" dur="5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
                        </animateMotion>
                    </circle>
                ))}
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                Creating a stable environment through Right Speech, Action, and Livelihood.
            </p>
        </div>
    );
};

export default EthicalConductPillarViz;