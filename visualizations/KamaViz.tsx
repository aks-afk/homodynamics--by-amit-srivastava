import React, { useEffect, useRef } from 'react';
// FIX: Replace monolithic d3 import with modular imports.
import { select } from 'd3-selection';
import { range } from 'd3-array';
import { timer } from 'd3-timer';

const KamaViz: React.FC = () => {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const width = 300;
        const height = 200;
        const svg = select(ref.current).attr("viewBox", `0 0 ${width} ${height}`).html('');

        const colors = ["#3A3A3A", "#5A5A5A", "#8A8A8A", "#C1C1C1"];
        const particles = range(80).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));

        const particleGroup = svg.selectAll("circle")
            .data(particles)
            .join("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 2)
            .attr("fill", d => d.color);

        const timerInstance = timer(() => {
            particleGroup
                .attr("cx", d => {
                    d.x += d.vx;
                    if (d.x > width) d.x = 0;
                    if (d.x < 0) d.x = width;
                    return d.x;
                })
                .attr("cy", d => {
                    d.y += d.vy;
                    if (d.y > height) d.y = 0;
                    if (d.y < 0) d.y = height;
                    return d.y;
                });
        });

        return () => timerInstance.stop();
    }, []);

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Kāma: Desire & Pleasure</h4>
            <div style={{ height: '200px', borderRadius: '4px', overflow: 'hidden' }}>
                <svg ref={ref} style={{ width: '100%', height: '100%' }}></svg>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                The flow of aesthetic, sensual, and emotional fulfillment.
            </p>
        </div>
    );
};

export default KamaViz;
