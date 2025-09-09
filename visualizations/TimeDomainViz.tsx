import React, { useRef, useEffect } from 'react';

const TimeDomainViz: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let animationFrameId: number | null = null;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = Math.min(250, width * 0.6);
        
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        container.appendChild(canvas);

        let time = 0;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            time += 0.012;

            // Clear canvas with cream background
            ctx.fillStyle = '#F0EEE6';
            ctx.fillRect(0, 0, width, height);

            // Set drawing style - charcoal lines
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';
            ctx.globalAlpha = 0.5;

            const centerX = width / 2;
            const centerY = height / 2;

            // Draw time flow as horizontal waves
            ctx.beginPath();
            for (let x = 0; x < width; x += 2) {
                const y = centerY + Math.sin((x * 0.02) + time * 2) * 20 + Math.sin((x * 0.01) + time) * 10;
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Draw memory layers as flowing horizontal bands
            for (let layer = 0; layer < 3; layer++) {
                const layerY = centerY - 60 + (layer * 40);
                const amplitude = 15 - (layer * 3);
                const frequency = 0.015 + (layer * 0.005);
                
                ctx.globalAlpha = 0.3 - (layer * 0.05);
                ctx.beginPath();
                for (let x = 0; x < width; x += 3) {
                    const y = layerY + Math.sin((x * frequency) + time * (1 + layer * 0.5)) * amplitude;
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }

            // Draw resilience pattern - vertical oscillations showing recovery
            ctx.globalAlpha = 0.4;
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 5; i++) {
                const x = (width / 6) * (i + 1);
                const baseHeight = height * 0.3;
                const oscillation = Math.sin(time * 3 + i) * baseHeight * 0.4;
                const recoveryHeight = baseHeight + oscillation;
                
                ctx.beginPath();
                ctx.moveTo(x, centerY + baseHeight);
                ctx.lineTo(x, centerY - recoveryHeight);
                ctx.stroke();
                
                // Small circle at the top
                ctx.beginPath();
                ctx.arc(x, centerY - recoveryHeight, 3, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Draw temporal connections - diagonal lines showing time relationships
            ctx.globalAlpha = 0.2;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 8; i++) {
                const startX = (width / 9) * i;
                const endX = startX + (width / 9) * 2;
                const startY = centerY + Math.sin(time + i * 0.5) * 30;
                const endY = centerY + Math.sin(time + i * 0.5 + 1) * 30;
                
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }

            // Draw learning curve - ascending spiral
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let t = 0; t < Math.PI * 4; t += 0.1) {
                const spiralRadius = 30 + (t / (Math.PI * 4)) * 40;
                const x = centerX + Math.cos(t + time * 0.5) * spiralRadius;
                const y = centerY + Math.sin(t + time * 0.5) * (spiralRadius * 0.3) - (t * 5);
                
                if (t === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Add text labels
            ctx.fillStyle = '#333333';
            ctx.font = '11px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.globalAlpha = 0.7;

            // Memory layer labels
            const memoryLabels = ['Long-term', 'Working', 'Immediate'];
            for (let layer = 0; layer < 3; layer++) {
                const layerY = centerY - 60 + (layer * 40);
                ctx.fillText(memoryLabels[layer], 50, layerY);
            }

            // Time flow label
            ctx.fillText('Time Flow', centerX, centerY + 35);

            // Resilience labels
            ctx.font = '10px Georgia, serif';
            for (let i = 0; i < 5; i++) {
                const x = (width / 6) * (i + 1);
                if (i % 2 === 0) {
                    ctx.fillText('Recovery', x, centerY + height * 0.35);
                }
            }

            // Learning curve label
            ctx.font = '10px Georgia, serif';
            ctx.fillText('Learning', centerX + 60, centerY - 80);
        };

        animate();

        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = Math.min(250, newWidth * 0.6);
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
                marginBottom: '1rem', 
                color: '#2c2a26', 
                fontWeight: '500',
                fontSize: '1.25rem',
                fontFamily: 'Georgia, serif',
                textAlign: 'center'
            }}>
                Time Domain: Resilience
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
                aria-label="Continuous animation showing flowing time patterns, memory layers, and resilience oscillations representing temporal dynamics"
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
                The time domain governs memory, learning, and the ability to recover from stress over time.
            </p>
        </div>
    );
};

export default TimeDomainViz;