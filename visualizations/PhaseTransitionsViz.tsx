import React, { useState } from 'react';

const PhaseTransitionsViz: React.FC = () => {
    const [toggled, setToggled] = useState(false);
    const path = "M 20 120 C 80 120, 80 40, 150 40 C 220 40, 220 120, 280 120";

    const buttonStyle: React.CSSProperties = {
        display: 'block', width: '100%', padding: '0.75rem', fontSize: '1rem',
        cursor: 'pointer', background: '#FDFBF6', color: '#3A3A3A',
        border: '1px solid #C1C1C1', borderRadius: '4px',
        fontFamily: 'Georgia, serif', marginTop: '1rem', transition: 'background 0.2s ease',
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Phase Transitions</h4>
            <svg viewBox="0 0 300 200">
                <path d={path} fill="none" stroke="#C1C1C1" strokeWidth="2" />
                <circle
                    cx={toggled ? 250 : 50}
                    cy={120}
                    r="8"
                    fill="#3A3A3A"
                    style={{ transition: 'cx 1s ease-in-out' }}
                />
                <text x="50" y="150" textAnchor="middle" fontSize="12">State A</text>
                <text x="250" y="150" textAnchor="middle" fontSize="12">State B</text>
                 <text x="150" y="30" textAnchor="middle" fontSize="12">Energy Barrier</text>
            </svg>
            <button onClick={() => setToggled(!toggled)} style={buttonStyle}>
                Trigger Transition
            </button>
        </div>
    );
};

export default PhaseTransitionsViz;