import React, { useEffect, useRef } from 'react';
// FIX: Replace monolithic d3 import with modular imports.
import { select } from 'd3-selection';
import { timer } from 'd3-timer';

const AboutViz: React.FC = () => {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const width = 300;
        const height = 300;
        const svg = select(ref.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .html('');

        const center = { x: width / 2, y: height / 2 };

        // Center circle (Homodynamics)
        svg.append('circle')
            .attr('cx', center.x)
            .attr('cy', center.y)
            .attr('r', 20)
            .attr('fill', '#3A3A3A')
            .append('animate')
            .attr('attributeName', 'r')
            .attr('values', '20;22;20')
            .attr('dur', '3s')
            .attr('repeatCount', 'indefinite');

        svg.append('text')
            .attr('x', center.x)
            .attr('y', center.y + 45)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('fill', '#3A3A3A')
            .text('Homodynamics');

        // Orbiting circles
        const orbiters = [
            { id: 'wisdom', radius: 80, angle: 0, speed: 0.005, label: 'Wisdom' },
            { id: 'science', radius: 110, angle: Math.PI, speed: -0.003, label: 'Science' }
        ];

        const orbiterGroup = svg.selectAll('.orbiter')
            .data(orbiters)
            .join('g')
            .attr('class', 'orbiter');

        orbiterGroup.append('circle')
            .attr('r', 10)
            .attr('fill', '#8A8A8A');
            
        orbiterGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '22px') // Position below the circle (r=10 + 12px padding)
            .style('font-size', '11px')
            .style('fill', '#5A5A5A') // Visible on light background
            .text(d => d.label);

        const timerInstance = timer(elapsed => {
            orbiterGroup.attr('transform', d => {
                d.angle += d.speed;
                const x = center.x + d.radius * Math.cos(d.angle);
                const y = center.y + d.radius * Math.sin(d.angle);
                return `translate(${x}, ${y})`;
            });
        });

        return () => timerInstance.stop();
    }, []);

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>The Synthesis</h4>
            <svg ref={ref} style={{ width: '100%', height: 'auto' }}></svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                An integration of ancient wisdom and modern science, originated by Amit Srivastava.
            </p>
        </div>
    );
};

export default AboutViz;
