import React, { useRef, useEffect } from 'react';

const WhatIsHomodynamicsViz: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let animationFrameId: number | null = null;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = Math.min(320, width * 0.6);
        
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        container.appendChild(canvas);

        let time = 0;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            time += 0.008;

            // Clear canvas with cream background
            ctx.fillStyle = '#F0EEE6';
            ctx.fillRect(0, 0, width, height);

            // Set drawing style - charcoal lines
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';
            ctx.globalAlpha = 0.6;

            const centerX = width / 2;
            const centerY = height / 2;
            const baseRadius = Math.min(width, height) * 0.15;

            // Draw interconnected circles representing synthesis
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + time * 0.3;
                const radius = baseRadius + Math.sin(time * 2 + i) * 20;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;

                // Draw circle
                ctx.beginPath();
                ctx.arc(x, y, 15 + Math.sin(time * 3 + i) * 5, 0, Math.PI * 2);
                ctx.stroke();

                // Draw connections to center
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.stroke();

                // Draw connections between adjacent nodes
                if (i < 5) {
                    const nextAngle = ((i + 1) / 6) * Math.PI * 2 + time * 0.3;
                    const nextRadius = baseRadius + Math.sin(time * 2 + (i + 1)) * 20;
                    const nextX = centerX + Math.cos(nextAngle) * nextRadius;
                    const nextY = centerY + Math.sin(nextAngle) * nextRadius;
                    
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(nextX, nextY);
                    ctx.stroke();
                }
            }

            // Draw central synthesis circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, 25 + Math.sin(time * 2) * 3, 0, Math.PI * 2);
            ctx.stroke();

            // Draw flowing patterns representing dynamic integration
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                const phase = time + (i * Math.PI * 2 / 3);
                for (let t = 0; t < Math.PI * 2; t += 0.1) {
                    const r = baseRadius * 0.7 + Math.sin(t * 3 + phase) * 15;
                    const x = centerX + Math.cos(t + phase * 0.5) * r;
                    const y = centerY + Math.sin(t + phase * 0.5) * r;
                    
                    if (t === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.stroke();
            }

            // Add text labels
            ctx.fillStyle = '#333333';
            ctx.font = '12px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.globalAlpha = 0.8;

            // Central label
            ctx.fillText('Synthesis', centerX, centerY + 4);

            // Outer circle labels
            const labels = ['Ancient\nWisdom', 'Modern\nScience', 'Consciousness', 'Systems', 'Integration', 'Flourishing'];
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + time * 0.3;
                const radius = baseRadius + Math.sin(time * 2 + i) * 20;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                ctx.font = '10px Georgia, serif';
                const lines = labels[i].split('\n');
                lines.forEach((line, lineIndex) => {
                    ctx.fillText(line, x, y + (lineIndex - lines.length/2 + 0.5) * 12);
                });
            }
        };

        animate();

        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = Math.min(320, newWidth * 0.6);
            canvas.width = newWidth;
            canvas.height = newHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (container.contains(canvas)) {
                container.removeChild(canvas);
            }
        };
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <h4 style={{ 
                marginTop: 0, 
                marginBottom: '1.5rem', 
                color: '#2c2a26', 
                fontWeight: '500',
                fontSize: '1.25rem',
                fontFamily: 'Georgia, serif',
                textAlign: 'center'
            }}>
                What is Homodynamics?
            </h4>
            
            <div 
                ref={containerRef}
                style={{
                    width: '100%',
                    height: 'auto',
                    background: '#F0EEE6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '200px'
                }}
                role="img"
                aria-label="Continuous geometric animation showing interconnected circles representing the synthesis of different knowledge domains"
            />
            
            <p style={{ 
                fontSize: '0.95rem',
                color: '#4a453e', 
                lineHeight: 1.6,
                textAlign: 'center', 
                marginTop: '2rem',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                maxWidth: '100%'
            }}>
                A synthesis framework bridging ancient wisdom with modern understanding, 
                revealing the dynamic patterns that govern human consciousness and flourishing.
            </p>
        </div>
    );
};

export default WhatIsHomodynamicsViz;
