import React, { useEffect, useRef } from 'react';
// FIX: Replace monolithic d3 import with modular imports.
import { select } from 'd3-selection';
import { range } from 'd3-array';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceX, forceY, Simulation } from 'd3-force';
import { drag, D3DragEvent } from 'd3-drag';
import { addVisualizationAccessibility, addInteractiveElementAccessibility, announceStateChange, respectsReducedMotion } from '../../utils/visualizationAccessibility';

interface VizNode {
  id: number;
  isCenter?: boolean;
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

const DynamicEquilibriumViz: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const width = 300;
    const height = 300;

    const svg = select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .html(''); // Clear previous render

    // Add accessibility features
    addVisualizationAccessibility(ref.current, {
      title: 'Dynamic Equilibrium System',
      description: 'An interactive force simulation showing a central node connected to surrounding nodes. The system maintains stability through constant motion and adjustment. Drag any node to perturb the system and observe how it returns to equilibrium.',
      keyboardInstructions: 'Use Tab to focus on nodes, Enter to select and drag with arrow keys',
      alternativeText: 'A network diagram with one central dark node connected to seven lighter surrounding nodes, all in constant gentle motion to maintain balance.'
    });

    const nodes: VizNode[] = [
      { id: 0, isCenter: true },
      ...range(1, 8).map(i => ({ id: i }))
    ];

    const links = nodes.slice(1).map(node => ({ source: 0, target: node.id }));

    const simulation = forceSimulation(nodes)
      .force('link', forceLink(links).id(d => (d as VizNode).id).distance(80).strength(0.2))
      .force('charge', forceManyBody().strength(-100))
      .force('center', forceCenter(width / 2, height / 2).strength(0.5))
      .force('x', forceX(width / 2).strength(0.05))
      .force('y', forceY(height / 2).strength(0.05));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#C1C1C1')
      .attr('stroke-width', 1);

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => (d.isCenter ? 12 : 7))
      .attr('fill', d => (d.isCenter ? '#3A3A3A' : '#8A8A8A'))
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', d => d.isCenter ? 'Central equilibrium node - drag to perturb system' : `Peripheral node ${d.id} - drag to see system response`)
      .call(dragHandler(simulation))
      .on('keydown', function(event, d) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          announceStateChange(d.isCenter ? 'Central node selected' : `Node ${d.id} selected`);
        }
        // Arrow key navigation for dragging
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
          event.preventDefault();
          const step = 5;
          let dx = 0, dy = 0;
          switch(event.key) {
            case 'ArrowUp': dy = -step; break;
            case 'ArrowDown': dy = step; break;
            case 'ArrowLeft': dx = -step; break;
            case 'ArrowRight': dx = step; break;
          }
          d.fx = (d.fx || d.x || 0) + dx;
          d.fy = (d.fy || d.y || 0) + dy;
          simulation.alphaTarget(0.3).restart();
          announceStateChange(`Node moved ${event.key.replace('Arrow', '').toLowerCase()}`);
        }
      });

    simulation.on('tick', () => {
      // Respect reduced motion preference
      if (respectsReducedMotion()) {
        simulation.stop();
        return;
      }
      
      link
        .attr('x1', d => (d.source as unknown as VizNode).x!)
        .attr('y1', d => (d.source as unknown as VizNode).y!)
        .attr('x2', d => (d.target as unknown as VizNode).x!)
        .attr('y2', d => (d.target as unknown as VizNode).y!);
      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);
    });

    return () => {
      simulation.stop();
    };

  }, []);
  
  // FIX: Renamed local function from `drag` to `dragHandler` to avoid shadowing the `d3-drag` import.
  // This resolves the "Expected 0 type arguments, but got 2" error on the `drag<...>()` call.
  const dragHandler = (simulation: Simulation<VizNode, undefined>) => {
    function dragstarted(event: D3DragEvent<SVGCircleElement, VizNode, VizNode>, d: VizNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event: D3DragEvent<SVGCircleElement, VizNode, VizNode>, d: VizNode) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event: D3DragEvent<SVGCircleElement, VizNode, VizNode>, d: VizNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    return drag<SVGCircleElement, VizNode>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  return (
    <div>
      <h4 style={{marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Dynamic Equilibrium</h4>
      <svg ref={ref} style={{ width: '100%', height: 'auto' }}></svg>
      <p style={{fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center'}}>A system in constant motion, yet maintaining stability. Drag the nodes to perturb the system.</p>
    </div>
  );
};

export default DynamicEquilibriumViz;