import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

const InformationTheoryViz: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);
  const [processingActive, setProcessingActive] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const width = 300;
    const height = 250;
    const svg = select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .html('');

    // Information processing pipeline
    const stages = [
      { x: 50, y: 125, label: 'Input\nSignal', color: '#E8B57C' },
      { x: 120, y: 125, label: 'Filter', color: '#FADE99' },
      { x: 190, y: 125, label: 'Process', color: '#F1F0EC' },
      { x: 260, y: 125, label: 'Output\nAction', color: '#C1C1C1' }
    ];

    // Draw processing stages
    stages.forEach((stage, i) => {
      svg.append('rect')
        .attr('x', stage.x - 20)
        .attr('y', stage.y - 15)
        .attr('width', 40)
        .attr('height', 30)
        .attr('fill', processingActive ? stage.color : '#F1F0EC')
        .attr('stroke', '#8A8A8A')
        .attr('stroke-width', 1)
        .attr('rx', 4)
        .style('transition', 'fill 0.5s');

      svg.append('text')
        .attr('x', stage.x)
        .attr('y', stage.y - 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '9')
        .attr('fill', '#3A3A3A')
        .selectAll('tspan')
        .data(stage.label.split('\n'))
        .join('tspan')
        .attr('x', stage.x)
        .attr('dy', (d, j) => j === 0 ? 0 : '1em')
        .text(d => d);

      // Arrows between stages
      if (i < stages.length - 1) {
        svg.append('path')
          .attr('d', `M ${stage.x + 20} ${stage.y} L ${stages[i + 1].x - 20} ${stage.y}`)
          .attr('stroke', processingActive ? '#5A5A5A' : '#C1C1C1')
          .attr('stroke-width', 2)
          .attr('marker-end', 'url(#info-arrow)')
          .style('transition', 'stroke 0.5s');
      }
    });

    // Information bits visualization
    const bitsData = processingActive ? [
      { x: 30, y: 80, active: true },
      { x: 40, y: 90, active: true },
      { x: 35, y: 100, active: false },
      { x: 45, y: 110, active: true },
      { x: 30, y: 120, active: true },
      { x: 40, y: 130, active: false },
      { x: 35, y: 140, active: true },
      { x: 45, y: 150, active: true }
    ] : [];

    svg.selectAll('.info-bit')
      .data(bitsData)
      .join('circle')
      .attr('class', 'info-bit')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 3)
      .attr('fill', d => d.active ? '#E8B57C' : '#C1C1C1')
      .attr('opacity', processingActive ? 1 : 0)
      .style('transition', 'opacity 0.5s');

    // Noise visualization
    const noiseData = processingActive ? [
      { x: 100, y: 70 }, { x: 110, y: 75 }, { x: 105, y: 85 },
      { x: 115, y: 90 }, { x: 100, y: 95 }, { x: 110, y: 100 }
    ] : [];

    svg.selectAll('.noise')
      .data(noiseData)
      .join('circle')
      .attr('class', 'noise')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 2)
      .attr('fill', '#8A8A8A')
      .attr('opacity', processingActive ? 0.6 : 0)
      .style('transition', 'opacity 0.5s');

    // Information content meter
    svg.append('rect')
      .attr('x', 20)
      .attr('y', 200)
      .attr('width', 260)
      .attr('height', 15)
      .attr('fill', '#F1F0EC')
      .attr('stroke', '#8A8A8A')
      .attr('stroke-width', 1);

    svg.append('rect')
      .attr('x', 20)
      .attr('y', 200)
      .attr('width', processingActive ? 180 : 0)
      .attr('height', 15)
      .attr('fill', '#E8B57C')
      .style('transition', 'width 0.5s');

    svg.append('text')
      .attr('x', 150)
      .attr('y', 230)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10')
      .attr('fill', '#5A5A5A')
      .text('Information Content (bits)');

    // Arrow marker
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'info-arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 9)
      .attr('refY', 3)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,0 L0,6 L9,3 z')
      .attr('fill', processingActive ? '#5A5A5A' : '#C1C1C1');

    // Labels
    svg.append('text')
      .attr('x', 150)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12')
      .attr('fill', '#3A3A3A')
      .attr('font-weight', 'bold')
      .text('Biological Information Processing');

    svg.append('text')
      .attr('x', 30)
      .attr('y', 60)
      .attr('text-anchor', 'start')
      .attr('font-size', '9')
      .attr('fill', '#5A5A5A')
      .text('Raw Data');

    svg.append('text')
      .attr('x', 105)
      .attr('y', 60)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9')
      .attr('fill', '#5A5A5A')
      .text('+ Noise');

  }, [processingActive]);

  const buttonStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    cursor: 'pointer',
    background: processingActive ? '#F1F0EC' : '#FCFBF8',
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
        Information Theory in Biology
      </h4>
      <svg ref={ref} style={{ width: '100%', height: 'auto' }}></svg>
      <button 
        onClick={() => setProcessingActive(!processingActive)}
        style={buttonStyle}
      >
        {processingActive ? 'Stop Processing' : 'Start Information Processing'}
      </button>
      <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '0.5rem' }}>
        Living systems filter signal from noise to extract meaningful information for survival.
      </p>
    </div>
  );
};

export default InformationTheoryViz;