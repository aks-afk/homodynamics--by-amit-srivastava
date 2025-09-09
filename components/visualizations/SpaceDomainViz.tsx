import React, { useRef, useEffect } from 'react';

const SpaceDomainViz: React.FC = () => {
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
            time += 0.008;

            // Clear canvas with cream background
            ctx.fillStyle = '#F0EEE6';
            ctx.fillRect(0, 0, width, height);

            // Set drawing style - charcoal lines
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';
            ctx.globalAlpha = 0.4;

            const centerX = width / 2;
            const centerY = height / 2;

            // Draw expanding context circles
            for (let i = 0; i < 4; i++) {
                const baseRadius = 30 + (i * 25);
                const radius = baseRadius + Math.sin(time + i * 0.5) * 8;
                
                ctx.globalAlpha = 0.4 - (i * 0.08);
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Draw adaptive connections - lines that reach out to environment
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 1;
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 + time * 0.3;
                const innerRadius = 20;
                const outerRadius = 80 + Math.sin(time * 2 + i) * 20;
                
                const innerX = centerX + Math.cos(angle) * innerRadius;
                const innerY = centerY + Math.sin(angle) * innerRadius;
                const outerX = centerX + Math.cos(angle) * outerRadius;
                const outerY = centerY + Math.sin(angle) * outerRadius;
                
                ctx.beginPath();
                ctx.moveTo(innerX, innerY);
                ctx.lineTo(outerX, outerY);
                ctx.stroke();
                
                // Small circles at connection points
                ctx.beginPath();
                ctx.arc(outerX, outerY, 2, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Draw central adaptive core
            ctx.globalAlpha = 0.6;
            ctx.lineWidth = 2;
            const coreRadius = 15 + Math.sin(time * 3) * 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Draw environmental boundaries - irregular shapes representing different contexts
            ctx.globalAlpha = 0.2;
            ctx.lineWidth = 1;
            for (let boundary = 0; boundary < 3; boundary++) {
                ctx.beginPath();
                const points = 12;
                const baseRadius = 60 + (boundary * 30);
                
                for (let i = 0; i <= points; i++) {
                    const angle = (i / points) * Math.PI * 2;
                    const noise = Math.sin(angle * 3 + time + boundary) * 15;
                    const radius = baseRadius + noise;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.stroke();
            }

            // Draw spatial flow patterns - curved lines showing movement through space
            ctx.globalAlpha = 0.25;
            ctx.lineWidth = 0.8;
            for (let flow = 0; flow < 6; flow++) {
                const startAngle = (flow / 6) * Math.PI * 2;
                const flowRadius = 40 + (flow % 2) * 20;
                
                ctx.beginPath();
                for (let t = 0; t < Math.PI; t += 0.1) {
                    const angle = startAngle + t + time * 0.5;
                    const radius = flowRadius + Math.sin(t * 2 + time) * 10;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    
                    if (t === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }

            // Add text labels
            ctx.fillStyle = '#333333';
            ctx.font = '11px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.globalAlpha = 0.7;

            // Central core label
            ctx.fillText('Self', centerX, centerY + 4);

            // Context circle labels
            const contextLabels = ['Personal', 'Social', 'Cultural', 'Global'];
            for (let i = 0; i < 4; i++) {
                const baseRadius = 30 + (i * 25);
                const angle = Math.PI / 4; // Top-right position
                const x = centerX + Math.cos(angle) * (baseRadius + 15);
                const y = centerY + Math.sin(angle) * (baseRadius + 15);
                
                ctx.font = '9px Georgia, serif';
                ctx.fillText(contextLabels[i], x, y);
            }

            // Adaptation labels
            ctx.font = '10px Georgia, serif';
            ctx.fillText('Adaptive', centerX, centerY - 40);
            ctx.fillText('Connections', centerX, centerY - 28);

            // Environmental boundaries label
            ctx.font = '9px Georgia, serif';
            ctx.fillText('Environment', centerX, centerY + height * 0.4);
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
                Space Domain: Adaptability
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
                aria-label="Continuous animation showing expanding context circles, adaptive connections reaching outward, and flowing spatial patterns representing environmental adaptability"
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
                The space domain governs environmental awareness and the ability to adapt to different contexts.
            </p>
        </div>
    );
};

export default SpaceDomainViz;