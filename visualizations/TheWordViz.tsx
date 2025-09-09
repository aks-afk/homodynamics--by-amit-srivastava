import React, { useEffect, useRef } from 'react';
// FIX: Replace monolithic d3 import with modular imports.
import { select } from 'd3-selection';
import { range } from 'd3-array';
import { timer } from 'd3-timer';

const TheWordViz: React.FC = () => {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const width = 300;
        const height = 150;

        const svg = select(ref.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .html('');

        const text = "HomoDynamics";
        
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("font-size", "36px")
            .style("font-family", "Georgia, serif")
            .style("fill", "#3A3A3A")
            .text(text);
            
        const particles = range(100).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        }));

        const particleGroup = svg.insert("g", "text")
            .selectAll("circle")
            .data(particles)
            .join("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 1.5)
            .attr("fill", "#8A8A8A")
            .attr("opacity", 0.5);

        const timerInstance = timer(elapsed => {
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
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>The Word</h4>
            <svg ref={ref} style={{ width: '100%', height: 'auto' }}></svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>The science of human forces in motion.</p>
        </div>
    );
};

export default TheWordViz;
