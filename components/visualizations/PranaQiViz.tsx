import React, { useEffect, useRef, useState } from 'react';
// FIX: Replace monolithic d3 import with modular imports.
import { select, Selection } from 'd3-selection';
import { path } from 'd3-path';
import { range } from 'd3-array';
import { easeLinear } from 'd3-ease';
import 'd3-transition';

const PranaQiViz: React.FC = () => {
    const ref = useRef<SVGSVGElement>(null);
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        const svg = select(ref.current);
        const width = 300;
        const height = 400;

        svg.html(''); // Clear previous

        const bodyPath = "M150,5 C100,5 90,40 90,80 C90,120 100,130 100,200 C100,270 90,280 90,340 C90,380 120,395 150,395 C180,395 210,380 210,340 C210,280 200,270 200,200 C200,130 210,120 210,80 C210,40 200,5 150,5 Z";
        svg.append("path")
            .attr("d", bodyPath)
            .attr("fill", "none")
            .attr("stroke", "#C1C1C1")
            .attr("stroke-width", 2);

        const flowPath = path();
        flowPath.moveTo(150, 10);
        flowPath.bezierCurveTo(150, 100, 120, 150, 120, 200);
        flowPath.bezierCurveTo(120, 250, 150, 300, 150, 390);
        const pathNode = svg.append("path")
            .attr("d", flowPath.toString())
            .attr("fill", "none")
            .attr("id", "flowPath");
        
        const pathLength = (pathNode.node() as SVGPathElement).getTotalLength();

        const particles = svg.append("g");
        range(30).forEach(i => {
            const particle = particles.append("circle")
                .attr("r", 2.5)
                .attr("fill", "#3A3A3A");
            
            animateParticle(particle);
        });

        function animateParticle(p: Selection<SVGCircleElement, unknown, null, undefined>) {
            const duration = 4000 + Math.random() * 2000;
            p.transition()
                .duration(duration)
                .ease(easeLinear)
                .attrTween("transform", function() {
                    return function(t) {
                        const point = (pathNode.node() as SVGPathElement).getPointAtLength(t * pathLength);
                        if (isBlocked && point.y > height / 2) {
                            p.interrupt(); // Stop animation if blocked
                            return `translate(${point.x}, ${height / 2})`;
                        }
                        return `translate(${point.x}, ${point.y})`;
                    }
                })
                .on("end", () => animateParticle(p));
        }
        
        // Blockage element
        svg.append("line")
            .attr("x1", 100)
            .attr("y1", height / 2)
            .attr("x2", 200)
            .attr("y2", height / 2)
            .attr("stroke", "#3A3A3A")
            .attr("stroke-width", 4)
            .attr("stroke-dasharray", "8 4")
            .attr("opacity", isBlocked ? 1 : 0)
            .style("transition", "opacity 0.3s");

    }, [isBlocked]);

    const buttonStyle: React.CSSProperties = {
        width: 'calc(50% - 0.5rem)',
        padding: '0.75rem',
        fontSize: '1rem',
        cursor: 'pointer',
        background: '#FDFBF6',
        color: '#3A3A3A',
        border: '1px solid #C1C1C1',
        borderRadius: '4px',
        fontFamily: 'Georgia, serif',
        transition: 'background 0.2s ease',
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Prāṇa & Qì Energy Flow</h4>
            <svg ref={ref} viewBox="0 0 300 400" style={{ width: '100%', height: 'auto' }}></svg>
            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <button onClick={() => setIsBlocked(true)} style={{...buttonStyle, background: isBlocked ? '#EAE8E1' : '#FDFBF6'}}>Create Blockage</button>
                <button onClick={() => setIsBlocked(false)} style={{...buttonStyle, background: !isBlocked ? '#EAE8E1' : '#FDFBF6'}}>Clear Blockage</button>
            </div>
        </div>
    );
};

export default PranaQiViz;