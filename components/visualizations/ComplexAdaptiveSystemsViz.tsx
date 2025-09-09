import React, { useRef, useEffect } from 'react';

const ComplexAdaptiveSystemsViz: React.FC = () => {
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

        // Agent positions and properties
        const agents = Array.from({ length: 8 }, (_, i) => ({
            baseAngle: (i / 8) * Math.PI * 2,
            phase: i * 0.5,
            radius: 60 + (i % 2) * 30
        }));

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            time += 0.01;

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

            // Calculate agent positions
            const agentPositions = agents.map(agent => {
                const angle = agent.baseAngle + Math.sin(time + agent.phase) * 0.3;
                const radius = agent.radius + Math.sin(time * 2 + agent.phase) * 15;
                return {
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius
                };
            });

            // Draw connections between nearby agents
            for (let i = 0; i < agentPositions.length; i++) {
                for (let j = i + 1; j < agentPositions.length; j++) {
                    const dx = agentPositions[j].x - agentPositions[i].x;
                    const dy = agentPositions[j].y - agentPositions[i].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.globalAlpha = 0.3 * (1 - distance / 120);
                        ctx.beginPath();
                        ctx.moveTo(agentPositions[i].x, agentPositions[i].y);
                        ctx.lineTo(agentPositions[j].x, agentPositions[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw agents as small circles
            ctx.globalAlpha = 0.7;
            agentPositions.forEach((pos, i) => {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 4 + Math.sin(time * 3 + i) * 2, 0, Math.PI * 2);
                ctx.stroke();
            });

            // Draw emergent patterns - larger geometric shapes that emerge from agent interactions
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 1.5;

            // Emergent pattern 1: Dynamic polygon connecting outer agents
            ctx.beginPath();
            for (let i = 0; i < agentPositions.length; i += 2) {
                const pos = agentPositions[i];
                if (i === 0) {
                    ctx.moveTo(pos.x, pos.y);
                } else {
                    ctx.lineTo(pos.x, pos.y);
                }
            }
            ctx.closePath();
            ctx.stroke();

            // Emergent pattern 2: Inner flowing circle
            ctx.beginPath();
            const innerRadius = 40 + Math.sin(time * 1.5) * 10;
            for (let t = 0; t < Math.PI * 2; t += 0.2) {
                const r = innerRadius + Math.sin(t * 4 + time * 2) * 8;
                const x = centerX + Math.cos(t) * r;
                const y = centerY + Math.sin(t) * r;
                
                if (t === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();

            // Emergent pattern 3: Radiating lines showing system-wide coordination
            ctx.globalAlpha = 0.2;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2 + time * 0.5;
                const length = 80 + Math.sin(time * 2 + i) * 20;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + Math.cos(angle) * length,
                    centerY + Math.sin(angle) * length
                );
                ctx.stroke();
            }

            // Add text labels
            ctx.fillStyle = '#333333';
            ctx.font = '11px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.globalAlpha = 0.7;

            // Label some agents
            agentPositions.forEach((pos, i) => {
                if (i % 2 === 0) { // Label every other agent
                    ctx.fillText('Agent', pos.x, pos.y - 15);
                }
            });

            // Label emergent patterns
            ctx.font = '12px Georgia, serif';
            ctx.globalAlpha = 0.6;
            ctx.fillText('Emergent', centerX, centerY - 60);
            ctx.fillText('Patterns', centerX, centerY - 45);

            // Label system coordination
            ctx.font = '10px Georgia, serif';
            ctx.fillText('System Coordination', centerX, centerY + 100);
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
                marginBottom: '1rem', 
                color: '#2c2a26', 
                fontWeight: '500',
                fontSize: '1.25rem',
                fontFamily: 'Georgia, serif',
                textAlign: 'center'
            }}>
                Complex Adaptive Systems
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
                aria-label="Continuous animation showing individual agents as small circles that move and connect, creating emergent geometric patterns"
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
                Individual agents interact to create emergent properties that cannot be predicted from the parts alone.
            </p>
        </div>
    );
};

export default ComplexAdaptiveSystemsViz;