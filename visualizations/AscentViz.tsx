import React, { useState } from 'react';

const AscentViz: React.FC = () => {
    const [ascending, setAscending] = useState(false);

    const buttonStyle: React.CSSProperties = {
        display: 'block',
        width: '100%',
        padding: '0.75rem',
        fontSize: '1rem',
        cursor: 'pointer',
        background: '#FDFBF6',
        color: '#3A3A3A',
        border: '1px solid #C1C1C1',
        borderRadius: '4px',
        fontFamily: 'Georgia, serif',
        marginTop: '1rem',
        transition: 'background 0.2s ease',
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>The Ascent as Model Refinement</h4>
            <div style={{ height: '200px', background: 'linear-gradient(to top, #5A5A5A 5%, #EAE8E1 95%)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '50%',
                    width: '20px',
                    height: '20px',
                    background: '#FCFBF8',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px white',
                    transform: ascending ? 'translate(-50%, -150px)' : 'translate(-50%, 0)',
                    transition: 'transform 2s ease-in-out',
                }}/>
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '3rem',
                    opacity: ascending ? 1 : 0.2,
                    filter: ascending ? 'blur(0)' : 'blur(5px)',
                    transition: 'opacity 2s ease-in-out 0.5s, filter 2s ease-in-out 0.5s'
                }}>
                    ☀️
                </div>
            </div>
            <button
                onClick={() => setAscending(!ascending)}
                onMouseOver={(e) => (e.currentTarget.style.background = '#F1F0EC')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#FDFBF6')}
                style={buttonStyle}
            >
                {ascending ? 'Return to Shadows' : 'Begin Ascent'}
            </button>
        </div>
    );
};

export default AscentViz;
