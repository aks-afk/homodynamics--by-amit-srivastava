import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

const NeuromodulationViz: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);
  const [activeSystem, setActiveSystem] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const width = 300;
    const height = 250;
    const svg = select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .html('');

    const centerX = width / 2;
    const centerY = height / 2;

    // Neurotransmitter systems
    const systems = [
      { 
        id: 'dopamine', 
        x: centerX - 60, 
        y: centerY - 40, 
        color: '#E8B57C', 
        label: 'Dopamine\n(Reward)', 
        pathways: [
          { x: centerX - 60, y: centerY - 40 },
          { x: centerX - 30, y: centerY - 60 },
          { x: centerX + 20, y: centerY - 50 }
        ]
      },
      { 
        id: 'serotonin', 
        x: centerX + 60, 
        y: centerY - 40, 
        color: '#FADE99', 
        label: 'Serotonin\n(Mood)', 
        pathways: [
          { x: centerX + 60, y: centerY - 40 },
          { x: centerX + 30, y: centerY - 20 },
          { x: centerX - 10, y: centerY - 30 }
        ]
      },
      { 
        id: 'norepinephrine', 
        x: centerX - 60, 
        y: centerY + 40, 
        color: '#F1F0EC', 
        label: 'Norepinephrine\n(Attention)', 
        pathways: [
          { x: centerX - 60, y: centerY + 40 },
          { x: centerX - 20, y: centerY + 20 },
          { x: centerX + 30, y: centerY + 30 }
        ]
      },
      { 
        id: 'gaba', 
        x: centerX + 60, 
        y: centerY + 40, 
        color: '#C1C1C1', 
        label: 'GABA\n(Inhibition)', 
        pathways: [
          { x: centerX + 60, y: centerY + 40 },
          { x: centerX + 20, y: centerY + 60 },
          { x: centerX - 20, y: centerY + 50 }
        ]
      }
    ];

    // Draw neural pathways
    systems.forEach(system => {
      if (activeSystem === system.id || activeSystem === null) {
        const opacity = activeSystem === system.id ? 0.8 : 0.3;
        
        // Draw pathway lines
        for (let i = 0; i < system.pathways.length - 1; i++) {
          svg.append('line')
            .attr('x1', system.pathways[i].x)
            .attr('y1', system.pathways[i].y)
            .attr('x2', system.pathways[i + 1].x)
            .attr('y2', system.pathways[i + 1].y)
            .attr('stroke', system.color)
            .attr('stroke-width', 2)
            .attr('opacity', opacity)
            .style('transition', 'opacity 0.5s');
        }

        // Draw pathway nodes
        system.pathways.forEach((point, i) => {
          svg.append('circle')
            .attr('cx', point.x)
            .attr('cy', point.y)
            .attr('r', i === 0 ? 8 : 4)
            .attr('fill', system.color)
            .attr('stroke', '#5A5A5A')
            .attr('stroke-width', i === 0 ? 2 : 1)
            .attr('opacity', opacity)
            .style('transition', 'opacity 0.5s');
        });
      }
    });

    // Draw main neurotransmitter nodes
    systems.forEach(system => {
      const isActive = activeSystem === system.id;
      const opacity = activeSystem === null ? 1 : (isActive ? 1 : 0.3);
      
      svg.append('circle')
        .attr('cx', system.x)
        .attr('cy', system.y)
        .attr('r', isActive ? 20 : 15)
        .attr('fill', system.color)
        .attr('stroke', '#5A5A5A')
        .attr('stroke-width', 2)
        .attr('opacity', opacity)
        .style('cursor', 'pointer')
        .style('transition', 'all 0.5s')
        .on('click', () => {
          setActiveSystem(activeSystem === system.id ? null : system.id);
        });

      // Labels
      svg.append('text')
        .attr('x', system.x)
        .attr('y', system.y - 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', '9')
        .attr('fill', '#5A5A5A')
        .attr('opacity', opacity)
        .style('transition', 'opacity 0.5s')
        .selectAll('tspan')
        .data(system.label.split('\n'))
        .join('tspan')
        .attr('x', system.x)
        .attr('dy', (d, i) => i === 0 ? 0 : '1em')
        .text(d => d);
    });

    // Central brain region
    svg.append('ellipse')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('rx', 25)
      .attr('ry', 15)
      .attr('fill', '#F8F9FA')
      .attr('stroke', '#8A8A8A')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3,3');

    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 3)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10')
      .attr('fill', '#3A3A3A')
      .text('Brain');

    // Effects panel
    if (activeSystem) {
      const effects = {
        dopamine: ['Motivation ↑', 'Focus ↑', 'Reward Seeking ↑'],
        serotonin: ['Mood ↑', 'Sleep Quality ↑', 'Anxiety ↓'],
        norepinephrine: ['Alertness ↑', 'Stress Response ↑', 'Memory ↑'],
        gaba: ['Anxiety ↓', 'Muscle Tension ↓', 'Sleep ↑']
      };

      const systemEffects = effects[activeSystem as keyof typeof effects] || [];
      
      svg.append('rect')
        .attr('x', 10)
        .attr('y', 180)
        .attr('width', 280)
        .attr('height', 60)
        .attr('fill', '#FCFBF8')
        .attr('stroke', '#C1C1C1')
        .attr('stroke-width', 1)
        .attr('rx', 4);

      svg.append('text')
        .attr('x', 20)
        .attr('y', 195)
        .attr('font-size', '10')
        .attr('fill', '#3A3A3A')
        .attr('font-weight', 'bold')
        .text(`${activeSystem.charAt(0).toUpperCase() + activeSystem.slice(1)} Effects:`);

      systemEffects.forEach((effect, i) => {
        svg.append('text')
          .attr('x', 20 + (i % 2) * 140)
          .attr('y', 210 + Math.floor(i / 2) * 15)
          .attr('font-size', '9')
          .attr('fill', '#5A5A5A')
          .text(`• ${effect}`);
      });
    }

    // Title
    svg.append('text')
      .attr('x', centerX)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12')
      .attr('fill', '#3A3A3A')
      .attr('font-weight', 'bold')
      .text('Neurotransmitter Systems');

  }, [activeSystem]);

  const buttonStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    cursor: 'pointer',
    background: activeSystem ? '#F1F0EC' : '#FCFBF8',
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
        Neuromodulation Systems
      </h4>
      <svg ref={ref} style={{ width: '100%', height: 'auto' }}></svg>
      <button 
        onClick={() => setActiveSystem(null)}
        style={buttonStyle}
      >
        {activeSystem ? 'Reset View' : 'Click neurotransmitter nodes to explore'}
      </button>
      <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '0.5rem' }}>
        Neurotransmitter systems modulate brain function, affecting mood, attention, and behavior.
      </p>
    </div>
  );
};

export default NeuromodulationViz;