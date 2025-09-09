import React, { useEffect, useRef, useState } from 'react';
// FIX: Replace monolithic d3 import with modular imports.
import { select } from 'd3-selection';
import { scaleOrdinal } from 'd3-scale';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, Simulation } from 'd3-force';
import { drag, D3DragEvent } from 'd3-drag';

// FIX: Replaced `extends d3.SimulationNodeDatum` with explicit properties to resolve TypeScript errors
// about properties not existing on the type. This appears to be a type resolution issue.
interface VizNode {
    id: string;
    group: number;
    index?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
}

const SynthesisViz: React.FC = () => {
    const ref = useRef<SVGSVGElement>(null);
    const [integration, setIntegration] = useState(0.1);

    const nodes: VizNode[] = [
        { id: "Homodynamics", group: 0 },
        { id: "Plato", group: 1 },
        { id: "Buddhism", group: 2 },
        { id: "Vedic Texts", group: 2 },
        { id: "Physics", group: 3 },
        { id: "Systems Theory", group: 3 },
        { id: "Physiology", group: 3 },
        { id: "Cognitive Science", group: 1 },
    ];
    const links = nodes.slice(1).map(node => ({ source: "Homodynamics", target: node.id }));

    useEffect(() => {
        if (!ref.current) return;

        const width = 300;
        const height = 300;
        const color = scaleOrdinal(["#3A3A3A", "#5A5A5A", "#8A8A8A", "#C1C1C1"]);

        const svg = select(ref.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .html('');

        const simulation = forceSimulation(nodes)
            .force('link', forceLink(links).id(d => (d as VizNode).id).strength(integration).distance(120))
            .force('charge', forceManyBody().strength(-150))
            .force('center', forceCenter(width / 2, height / 2))
            .force('collide', forceCollide().radius(d => (d as VizNode).id === 'Homodynamics' ? 50 : 40).strength(0.8));
        
        const link = svg.append("g")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke", "#C1C1C1")
            .attr("stroke-opacity", 0.6);

        const node = svg.append("g")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .call(dragHandler(simulation));
        
        node.append("circle")
            .attr("r", d => d.id === 'Homodynamics' ? 40 : 12)
            .attr("fill", d => color(d.group.toString()));

        node.append("text")
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .attr("y", d => d.id === 'Homodynamics' ? 0 : 24)
            .style("font-size", "10px")
            .style("fill", d => d.id === 'Homodynamics' ? '#FCFBF8' : '#5A5A5A')
            .each(function(d) {
                if (d.id === 'Homodynamics') {
                    // Vertically center the text inside the main node
                    select(this).attr('dy', '0.35em');
                } else {
                    // Manually wrap long labels to keep it simple
                    const longLabels: {[key: string]: string[]} = {
                        'Vedic Texts': ['Vedic', 'Texts'],
                        'Systems Theory': ['Systems', 'Theory'],
                        'Cognitive Science': ['Cognitive', 'Science']
                    };
                    if (longLabels[d.id]) {
                        const text = select(this);
                        text.text(''); // Clear original text
                        const words = longLabels[d.id];
                        words.forEach((word, i) => {
                            text.append('tspan')
                                .attr('x', 0)
                                .attr('dy', i > 0 ? '1.2em' : 0)
                                .text(word);
                        });
                    }
                }
            });

        simulation.on("tick", () => {
            link
                // FIX: D3 mutates the link objects, replacing `source` and `target` IDs with node objects.
                // We must cast through `unknown` to inform TypeScript of this change.
                .attr("x1", d => (d.source as unknown as VizNode).x!)
                .attr("y1", d => (d.source as unknown as VizNode).y!)
                .attr("x2", d => (d.target as unknown as VizNode).x!)
                .attr("y2", d => (d.target as unknown as VizNode).y!);
            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });

        // FIX: The useEffect cleanup function should return void. `simulation.stop()` returns the simulation instance,
        // so we wrap it in curly braces to prevent an implicit return.
        return () => {
          simulation.stop();
        };

    }, [integration, links, nodes]);

    // FIX: Renamed local function from `drag` to `dragHandler` to avoid shadowing the `d3-drag` import.
    // This resolves the "Expected 0 type arguments, but got 2" error on the `drag<...>()` call.
    const dragHandler = (simulation: Simulation<VizNode, undefined>) => {
      function dragstarted(event: D3DragEvent<SVGGElement, VizNode, VizNode>, d: VizNode) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(event: D3DragEvent<SVGGElement, VizNode, VizNode>, d: VizNode) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event: D3DragEvent<SVGGElement, VizNode, VizNode>, d: VizNode) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      return drag<SVGGElement, VizNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Synthesis of Concepts</h4>
            <svg ref={ref} style={{ width: '100%', height: 'auto' }}></svg>
            <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.2rem', color: '#5A5A5A', fontSize: '0.9rem' }}>Integration Strength</label>
                <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={integration}
                    onChange={(e) => setIntegration(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#3A3A3A' }}
                />
            </div>
        </div>
    );
};

export default SynthesisViz;