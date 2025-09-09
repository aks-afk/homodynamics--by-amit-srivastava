import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { line, curveCardinal } from 'd3-shape';

const ThermodynamicsViz: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const width = 300;
    const height = 250;
    const svg = select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .html('');

    // Energy flow visualization
    const xScale = scaleLinear().domain([0, 10]).range([30, 270]);
    const yScale = scaleLinear().domain([0, 1]).range([200, 50]);

    // Create energy flow path
    const energyData = [
      [0, 0.1], [1, 0.3], [2, 0.7], [3, 0.9], [4, 0.8], 
      [5, 0.6], [6, 0.4], [7, 0.3], [8, 0.2], [9, 0.1], [10, 0.05]
    ];

    const lineGenerator = line<[number, number]>()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(curveCardinal);

    // System boundary
    svg.append('rect')
      .attr('x', 20)
      .attr('y', 40)
      .attr('width', 260)
      .attr('height', 170)
      .attr('fill', 'none')
      .attr('stroke', '#8A8A8A')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Energy input arrow
    svg.append('path')
      .attr('d', 'M 10 100 L 25 100')
      .attr('stroke', '#E8B57C')
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrow-input)');

    // Energy output arrow
    svg.append('path')
      .attr('d', 'M 275 180 L 290 180')
      .attr('stroke', '#C1C1C1')
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrow-output)');

    // Energy flow line
    svg.append('path')
      .datum(energyData)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', isActive ? '#E8B57C' : '#C1C1C1')
      .attr('stroke-width', 2)
      .style('transition', 'stroke 0.5s');

    // Dissipative structure (organism)
    svg.append('ellipse')
      .attr('cx', 150)
      .attr('cy', 125)
      .attr('rx', 40)
      .attr('ry', 25)
      .attr('fill', isActive ? '#FADE99' : '#F1F0EC')
      .attr('stroke', '#8A8A8A')
      .attr('stroke-width', 1.5)
      .style('transition', 'fill 0.5s');

    // Entropy indicators
    const entropyPoints = [
      [50, 60], [80, 70], [110, 65], [190, 65], [220, 70], [250, 60]
    ];

    svg.selectAll('.entropy')
      .data(entropyPoints)
      .join('circle')
      .attr('class', 'entropy')
      .attr('cx', d => d[0])
      .attr('cy', d => d[1])
      .attr('r', 3)
      .attr('fill', isActive ? '#8A8A8A' : '#C1C1C1')
      .style('transition', 'fill 0.5s');

    // Arrow markers
    const defs = svg.append('defs');
    
    defs.append('marker')
      .attr('id', 'arrow-input')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 9)
      .attr('refY', 3)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,0 L0,6 L9,3 z')
      .attr('fill', '#E8B57C');

    defs.append('marker')
      .attr('id', 'arrow-output')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 9)
      .attr('refY', 3)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,0 L0,6 L9,3 z')
      .attr('fill', '#C1C1C1');

    // Labels
    svg.append('text')
      .attr('x', 15)
      .attr('y', 95)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10')
      .attr('fill', '#5A5A5A')
      .text('Energy');

    svg.append('text')
      .attr('x', 15)
      .attr('y', 107)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10')
      .attr('fill', '#5A5A5A')
      .text('Input');

    svg.append('text')
      .attr('x', 285)
      .attr('y', 175)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10')
      .attr('fill', '#5A5A5A')
      .text('Heat');

    svg.append('text')
      .attr('x', 285)
      .attr('y', 187)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10')
      .attr('fill', '#5A5A5A')
      .text('Waste');

    svg.append('text')
      .attr('x', 150)
      .attr('y', 130)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12')
      .attr('fill', '#3A3A3A')
      .attr('font-weight', 'bold')
      .text('Living System');

    svg.append('text')
      .attr('x', 150)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11')
      .attr('fill', '#5A5A5A')
      .text('Non-Equilibrium Thermodynamics');

  }, [isActive]);

  const buttonStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    cursor: 'pointer',
    background: isActive ? '#F1F0EC' : '#FCFBF8',
    color: '#3A3A3A',
    border: '1px solid #C1C1C1',
    borderRadius: '4px',
    fontFamily: 'Georgia, serif',
    marginTop: '1rem',
    transition: 'background 0.2s ease',
  };

  return (
    <div>
      <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>
        Thermodynamics of Living Systems
      </h4>
      <svg ref={ref} style={{ width: '100%', height: 'auto' }}></svg>
      <button 
        onClick={() => setIsActive(!isActive)}
        style={buttonStyle}
      >
        {isActive ? 'Stop Energy Flow' : 'Start Energy Flow'}
      </button>
      <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '0.5rem' }}>
        Living systems maintain order by continuously processing energy and dissipating entropy.
      </p>
    </div>
  );
};

export default ThermodynamicsViz;