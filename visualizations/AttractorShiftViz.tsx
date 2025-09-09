import React, { useEffect, useRef, useState } from 'react';
// FIX: Replace monolithic d3 import with modular imports.
import { select } from 'd3-selection';
import { forceSimulation, forceManyBody, forceCenter, Simulation } from 'd3-force';
import 'd3-transition';

// FIX: Remove `extends d3.SimulationNodeDatum` and define properties to resolve type error.
interface VizNode {
  id: number;
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

const AttractorShiftViz: React.FC = () => {
    const ref = useRef<SVGSVGElement>(null);
    const [shifted, setShifted] = useState(false);
    // FIX: Initialize useRef with null to satisfy the "Expected 1 arguments" error.
    const simulationRef = useRef<Simulation<VizNode, undefined> | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const width = 300;
        const height = 200;

        const svg = select(ref.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .html('');
        
        const nodes: VizNode[] = [{ id: 0 }];
        
        simulationRef.current = forceSimulation(nodes)
            .force('charge', forceManyBody().strength(-30));
        
        // Visual representation of attractors
        svg.append("circle")
            .attr("class", "attractor-1")
            .attr("cx", width * 0.25)
            .attr("cy", height * 0.5)
            .attr("r", 50)
            .attr("fill", "rgba(193, 193, 193, 0.3)")
            .attr("stroke", "#C1C1C1")
            .attr("stroke-dasharray", "4 2");

        svg.append("circle")
            .attr("class", "attractor-2")
            .attr("cx", width * 0.75)
            .attr("cy", height * 0.5)
            .attr("r", 30)
            .attr("fill", "transparent")
            .attr("stroke", "#C1C1C1");
        
        const node = svg.append("g")
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 8)
            .attr("fill", "#3A3A3A");

        simulationRef.current.on('tick', () => {
            node.attr('cx', d => d.x!).attr('cy', d => d.y!);
        });
        
        // FIX: The useEffect cleanup function should return void. `simulation.stop()` returns the simulation instance,
        // so we wrap it in curly braces to prevent an implicit return.
        return () => {
            simulationRef.current?.stop();
        };

    }, []);

    useEffect(() => {
      const simulation = simulationRef.current;
      if (!simulation) return;
      const width = 300;
      const height = 200;

      if (shifted) {
          simulation.force('center', forceCenter(width * 0.75, height * 0.5).strength(1.5));
          select('.attractor-2').transition().duration(500).attr('r', 70).attr('fill', 'rgba(138, 138, 138, 0.2)');
      } else {
          simulation.force('center', forceCenter(width * 0.25, height * 0.5).strength(0.5));
          select('.attractor-2').transition().duration(500).attr('r', 30).attr('fill', 'transparent');
      }
      simulation.alpha(1).restart();

    }, [shifted]);
    
    const buttonStyle: React.CSSProperties = {
        display: 'block', width: '100%', padding: '0.75rem', fontSize: '1rem',
        cursor: 'pointer', background: '#FDFBF6', color: '#3A3A3A',
        border: '1px solid #C1C1C1', borderRadius: '4px',
        fontFamily: 'Georgia, serif', marginTop: '1rem', transition: 'background 0.2s ease',
    };

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Shifting Between Attractors</h4>
            <svg ref={ref} style={{ width: '100%', height: 'auto' }}></svg>
            <button onClick={() => setShifted(!shifted)} style={buttonStyle}>
                {shifted ? 'Return to Old Attractor' : 'Shift Perspective'}
            </button>
        </div>
    );
};

export default AttractorShiftViz;