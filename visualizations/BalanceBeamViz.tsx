import React, { useState } from 'react';

const BalanceBeamViz: React.FC = () => {
    const [stability, setStability] = useState(50);
    const [flexibility, setFlexibility] = useState(50);

    const rotation = (flexibility - stability) * 0.3;
    const isBalanced = Math.abs(stability - flexibility) < 15;

    let statusText = "Dynamic Balance";
    if (!isBalanced) {
        statusText = stability > flexibility ? "Stagnation Risk" : "Chaos Risk";
    }

    const Slider = ({ label, value, onChange }: { label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.2rem', color: '#5A5A5A', fontSize: '0.9rem' }}>{label}</label>
        <input type="range" min="1" max="100" value={value} onChange={onChange} style={{ width: '100%', accentColor: '#3A3A3A' }} />
      </div>
    );

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Balancing Stability & Flexibility</h4>
            <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '200px', height: '100px'}}>
                    {/* Beam */}
                    <div style={{
                        position: 'absolute',
                        bottom: '50px',
                        left: '0',
                        width: '200px',
                        height: '10px',
                        background: '#3A3A3A',
                        borderRadius: '5px',
                        transform: `rotate(${rotation}deg)`,
                        transition: 'transform 0.3s ease',
                        transformOrigin: 'center center'
                    }}/>
                    {/* Fulcrum */}
                    <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '90px',
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderBottom: '40px solid #8A8A8A',
                    }}/>
                </div>
            </div>
            <p style={{textAlign: 'center', color: '#3A3A3A', fontWeight: 600, fontSize: '1.1rem', minHeight: '1.2em'}}>
                {statusText}
            </p>
            <Slider label="Stability" value={stability} onChange={e => setStability(+e.target.value)} />
            <Slider label="Flexibility" value={flexibility} onChange={e => setFlexibility(+e.target.value)} />
        </div>
    );
};

export default BalanceBeamViz;
