import React, { useState } from 'react';

const ReasonViz: React.FC = () => {
    const [leftWeight, setLeftWeight] = useState(2);
    const [rightWeight, setRightWeight] = useState(2);

    const tilt = (rightWeight - leftWeight) * 5; // Max tilt 20 degrees

    const containerStyle: React.CSSProperties = {
        height: '220px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '1rem',
    };

    const beamStyle: React.CSSProperties = {
        width: '200px',
        height: '8px',
        backgroundColor: '#3A3A3A',
        borderRadius: '4px',
        position: 'relative',
        transform: `rotate(${tilt}deg)`,
        transition: 'transform 0.5s ease',
        transformOrigin: 'center',
    };
    
    const weightStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: '-25px',
        width: '20px',
        height: '20px',
        backgroundColor: '#8A8A8A',
        borderRadius: '2px',
    };

    const buttonStyle: React.CSSProperties = {
        width: '40px',
        height: '40px',
        margin: '0 5px',
        fontSize: '1.5rem',
        cursor: 'pointer',
        background: '#FDFBF6',
        color: '#3A3A3A',
        border: '1px solid #C1C1C1',
        borderRadius: '4px',
        fontFamily: 'Georgia, serif',
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#3A3A3A', fontWeight: 'normal' }}>Reason: The Control Mechanism</h4>
            <div style={containerStyle}>
                <div style={beamStyle}>
                    <div style={{ ...weightStyle, left: '10px' }}>
                         <span style={{position: 'absolute', top: '-2px', left: '6px', color: 'white'}}>{leftWeight}</span>
                    </div>
                    <div style={{ ...weightStyle, right: '10px' }}>
                         <span style={{position: 'absolute', top: '-2px', left: '6px', color: 'white'}}>{rightWeight}</span>
                    </div>
                </div>
                <div style={{ width: '10px', height: '50px', backgroundColor: '#5A5A5A', marginTop: '-2px' }} />
                <div style={{ width: '60px', height: '10px', backgroundColor: '#5A5A5A', borderRadius: '3px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '0.5rem' }}>
                <div>
                    <button onClick={() => setLeftWeight(w => Math.max(0, w - 1))} style={buttonStyle}>-</button>
                    <button onClick={() => setLeftWeight(w => Math.min(5, w + 1))} style={buttonStyle}>+</button>
                </div>
                <div>
                    <button onClick={() => setRightWeight(w => Math.max(0, w - 1))} style={buttonStyle}>-</button>
                    <button onClick={() => setRightWeight(w => Math.min(5, w + 1))} style={buttonStyle}>+</button>
                </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                Reason weighs inputs to guide the system toward balance.
            </p>
        </div>
    );
};

export default ReasonViz;