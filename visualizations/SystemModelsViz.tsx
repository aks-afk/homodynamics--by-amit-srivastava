import React, { useState } from 'react';

const SystemModelsViz: React.FC = () => {
    const [isClear, setIsClear] = useState(false);

    const buttonStyle: React.CSSProperties = {
        display: 'block', width: '100%', padding: '0.75rem', fontSize: '1rem',
        cursor: 'pointer', background: '#FDFBF6', color: '#3A3A3A',
        border: '1px solid #C1C1C1', borderRadius: '4px',
        fontFamily: 'Georgia, serif', marginTop: '1rem', transition: 'background 0.2s ease',
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Establishing Accurate Models</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                <defs>
                    <filter id="blurFilter">
                        <feGaussianBlur in="SourceGraphic" stdDeviation={isClear ? 0 : 5} />
                    </filter>
                </defs>
                <g filter="url(#blurFilter)" style={{ transition: 'filter 1s ease' }}>
                    <path 
                        d={isClear ? "M 50 150 L 100 50 L 150 150 L 200 50 L 250 150" : "M 50 150 C 100 50, 150 150, 200 50 S 250 150, 250 150"} 
                        stroke="#3A3A3A" 
                        strokeWidth="3" 
                        fill="none"
                        style={{ transition: 'd 1s ease' }}
                    />
                </g>
            </svg>
            <button onClick={() => setIsClear(!isClear)} style={buttonStyle}>
                {isClear ? 'Introduce Ignorance' : 'Gain Clarity'}
            </button>
        </div>
    );
};

export default SystemModelsViz;