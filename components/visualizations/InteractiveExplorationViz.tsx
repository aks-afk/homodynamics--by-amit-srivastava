import React, { useEffect, useRef } from 'react';
// FIX: Replace monolithic d3 import with modular imports.
import { select, pointer } from 'd3-selection';
import { range } from 'd3-array';
import { forceSimulation, forceManyBody, forceCenter, forceCollide, forceX, forceY } from 'd3-force';

interface VizNode {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

const InteractiveExplorationViz: React.FC = () => {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const width = 300;
        const height = 250;
        const svg = select(ref.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .html('');

        const nodes: VizNode[] = range(100).map(i => ({
            id: i,
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
        }));

        const simulation = forceSimulation(nodes)
            .force('charge', forceManyBody().strength(-5))
            .force('center', forceCenter(width / 2, height / 2))
            .force('collision', forceCollide().radius(5));

        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', 3)
            .attr('fill', '#8A8A8A');

        simulation.on('tick', () => {
            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        });

        const mousemove = (event: MouseEvent) => {
            const [mx, my] = pointer(event);
            simulation.force('x', forceX(mx).strength(0.05));
            simulation.force('y', forceY(my).strength(0.05));
            simulation.alpha(0.3).restart();
        };
        
        const mouseleave = () => {
             simulation.force('x', null);
             simulation.force('y', null);
             simulation.alpha(0.1).restart();
        }

        svg.on('mousemove', mousemove);
        svg.on('mouseleave', mouseleave);

        return () => {
            simulation.stop();
            svg.on('mousemove', null);
            svg.on('mouseleave', null);
        };
    }, []);

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Interactive Exploration</h4>
            <svg ref={ref} style={{ width: '100%', height: 'auto', background: '#F1F0EC', borderRadius: '4px', cursor: 'pointer' }}></svg>
             <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                Move your cursor to interact with the system.
            </p>
        </div>
    );
};

export default InteractiveExplorationViz;
