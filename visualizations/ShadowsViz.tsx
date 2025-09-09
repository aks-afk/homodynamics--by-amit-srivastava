import React, { useEffect, useRef } from 'react';

const ShadowsViz: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    // FIX: Initialize useRef with null to satisfy the "Expected 1 arguments, but got 0" error.
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.style.setProperty('--rotation', '0deg');
            const animate = () => {
                if (ref.current) {
                    const currentRotation = parseFloat(getComputedStyle(ref.current).getPropertyValue('--rotation'));
                    ref.current.style.setProperty('--rotation', `${(currentRotation + 0.2) % 360}deg`);
                }
                animationFrameId.current = requestAnimationFrame(animate);
            };
            animationFrameId.current = requestAnimationFrame(animate);
            return () => {
              if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
            };
        }
    }, []);

    const cubeStyle: React.CSSProperties = {
        width: '60px',
        height: '60px',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: 'rotateX(-20deg) rotateY(var(--rotation, 45deg))',
        margin: '2rem auto 1rem',
    };

    const faceStyle: React.CSSProperties = {
        position: 'absolute',
        width: '60px',
        height: '60px',
        border: '1px solid #3A3A3A',
        background: 'rgba(138, 138, 138, 0.1)',
        opacity: 0.8
    };
    
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Low-Information Models</h4>
            <div style={{ height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', perspective: '400px' }}>
                <div ref={ref}>
                    <div style={cubeStyle}>
                        <div style={{ ...faceStyle, transform: 'rotateY(0deg) translateZ(30px)' }} />
                        <div style={{ ...faceStyle, transform: 'rotateY(90deg) translateZ(30px)' }} />
                        <div style={{ ...faceStyle, transform: 'rotateY(180deg) translateZ(30px)' }} />
                        <div style={{ ...faceStyle, transform: 'rotateY(-90deg) translateZ(30px)' }} />
                        <div style={{ ...faceStyle, transform: 'rotateX(90deg) translateZ(30px)' }} />
                        <div style={{ ...faceStyle, transform: 'rotateX(-90deg) translateZ(30px)' }} />
                    </div>
                </div>
                 <div style={{ 
                    width: '80px', height: '10px', background: '#C1C1C1', borderRadius: '50%',
                    transform: 'scaleX(1.5)',
                    opacity: 0.4, filter: 'blur(4px)', marginTop: '2rem'
                 }}></div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                Our internal models are like shadows: useful, but incomplete representations of a richer reality.
            </p>
        </div>
    );
};

export default ShadowsViz;