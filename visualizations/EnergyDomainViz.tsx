import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { addVisualizationAccessibility, announceStateChange, respectsReducedMotion } from '../../utils/visualizationAccessibility';

const EnergyDomainViz: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);
  const [energyLevel, setEnergyLevel] = useState(0.5);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const width = 300;
    const height = 250;
    const svg = select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .html('');

    // Add accessibility features
    addVisualizationAccessibility(ref.current, {
      title: 'Energy Domain: Fortitude Visualization',
      description: `Interactive energy system showing fortitude at ${Math.round(energyLevel * 100)}% capacity. ${focusMode ? 'Focus mode is active, showing enhanced energy flow and concentration.' : 'Normal mode showing balanced energy distribution across attention, vitality, focus, and flow dimensions.'}`,
      keyboardInstructions: 'Use slider to adjust energy level, button to toggle focus mode',
      alternativeText: `A radial energy diagram with a central core at ${Math.round(energyLevel * 100)}% intensity, connected to four energy nodes: Attention, Vitality, Focus, and Flow. ${focusMode ? 'The system glows with enhanced golden energy indicating active focus mode.' : 'The system shows steady energy flow in normal operational mode.'}`
    });

    const centerX = width / 2;
    const centerY = height / 2;

    // Energy core
    const coreRadius = 30 + (energyLevel * 20);
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', coreRadius)
      .attr('fill', focusMode ? '#E8B57C' : '#FADE99')
      .attr('opacity', 0.3 + (energyLevel * 0.4))
      .style('transition', 'all 0.5s');

    // Energy rings
    const rings = [1.2, 1.5, 1.8];
    rings.forEach((multiplier, i) => {
      svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', coreRadius * multiplier)
        .attr('fill', 'none')
        .attr('stroke', focusMode ? '#E8B57C' : '#C1C1C1')
        .attr('stroke-width', 1)
        .attr('opacity', energyLevel * (1 - i * 0.2))
        .style('transition', 'all 0.5s');
    });

    // Energy flow indicators
    const flowPoints = [
      { angle: 0, label: 'Attention' },
      { angle: Math.PI / 2, label: 'Vitality' },
      { angle: Math.PI, label: 'Focus' },
      { angle: 3 * Math.PI / 2, label: 'Flow' }
    ];

    flowPoints.forEach(point => {
      const x = centerX + Math.cos(point.angle) * (coreRadius + 40);
      const y = centerY + Math.sin(point.angle) * (coreRadius + 40);
      
      // Energy node
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 8)
        .attr('fill', focusMode ? '#E8B57C' : '#F1F0EC')
        .attr('stroke', '#8A8A8A')
        .attr('stroke-width', 1)
        .style('transition', 'fill 0.5s');

      // Connection line
      svg.append('line')
        .attr('x1', centerX + Math.cos(point.angle) * coreRadius)
        .attr('y1', centerY + Math.sin(point.angle) * coreRadius)
        .attr('x2', x - Math.cos(point.angle) * 8)
        .attr('y2', y - Math.sin(point.angle) * 8)
        .attr('stroke', focusMode ? '#8A8A8A' : '#C1C1C1')
        .attr('stroke-width', energyLevel * 2 + 0.5)
        .style('transition', 'all 0.5s');

      // Label
      svg.append('text')
        .attr('x', x + Math.cos(point.angle) * 20)
        .attr('y', y + Math.sin(point.angle) * 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10')
        .attr('fill', '#5A5A5A')
        .text(point.label);
    });

    // Energy level indicator
    svg.append('rect')
      .attr('x', 20)
      .attr('y', 220)
      .attr('width', 260)
      .attr('height', 8)
      .attr('fill', '#F1F0EC')
      .attr('stroke', '#C1C1C1')
      .attr('stroke-width', 1);

    svg.append('rect')
      .attr('x', 20)
      .attr('y', 220)
      .attr('width', 260 * energyLevel)
      .attr('height', 8)
      .attr('fill', focusMode ? '#E8B57C' : '#FADE99')
      .style('transition', 'all 0.5s');

    // Labels
    svg.append('text')
      .attr('x', centerX)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12')
      .attr('fill', '#3A3A3A')
      .attr('font-weight', 'bold')
      .text('Energy Domain: Fortitude');

    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11')
      .attr('fill', '#3A3A3A')
      .text('Core');

    svg.append('text')
      .attr('x', 20)
      .attr('y', 245)
      .attr('font-size', '9')
      .attr('fill', '#5A5A5A')
      .text('Low');

    svg.append('text')
      .attr('x', 280)
      .attr('y', 245)
      .attr('text-anchor', 'end')
      .attr('font-size', '9')
      .attr('fill', '#5A5A5A')
      .text('High');

  }, [energyLevel, focusMode]);

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    margin: '1rem 0',
    cursor: 'pointer'
  };

  const buttonStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    cursor: 'pointer',
    background: focusMode ? '#F1F0EC' : '#FCFBF8',
    color: '#3A3A3A',
    border: '1px solid #C1C1C1',
    borderRadius: '4px',
    fontFamily: 'Georgia, serif',
    marginTop: '0.5rem',
    transition: 'background 0.2s ease',
  };

  return (
    <div>
      <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>
        Energy Domain: Fortitude
      </h4>
      <svg ref={ref} style={{ width: '100%', height: 'auto' }}></svg>
      
      <div style={{ marginTop: '1rem' }}>
        <label style={{ fontSize: '0.9rem', color: '#5A5A5A', display: 'block', marginBottom: '0.5rem' }}>
          Energy Level: {Math.round(energyLevel * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={energyLevel}
          onChange={(e) => {
            const newLevel = parseFloat(e.target.value);
            setEnergyLevel(newLevel);
            announceStateChange(`Energy level adjusted to ${Math.round(newLevel * 100)} percent`);
          }}
          style={sliderStyle}
          aria-label="Energy level slider"
          aria-describedby="energy-level-description"
        />
        <div id="energy-level-description" className="sr-only">
          Adjust the energy level from 0 to 100 percent to see how it affects the fortitude system's capacity and energy flow patterns.
        </div>
      </div>

      <button 
        onClick={() => {
          const newFocusMode = !focusMode;
          setFocusMode(newFocusMode);
          announceStateChange(newFocusMode 
            ? 'Focus mode activated - energy system now shows enhanced concentration and golden energy flow'
            : 'Focus mode deactivated - energy system returned to normal balanced state'
          );
        }}
        style={buttonStyle}
        aria-describedby="focus-mode-description"
      >
        {focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
      </button>
      <div id="focus-mode-description" className="sr-only">
        {focusMode 
          ? 'Click to exit focus mode and return to normal energy distribution'
          : 'Click to enter focus mode and see enhanced energy concentration and flow patterns'
        }
      </div>
      
      <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '0.5rem' }}>
        The energy domain governs attention, vitality, and the capacity for sustained focus and flow states.
      </p>
    </div>
  );
};

export default EnergyDomainViz;