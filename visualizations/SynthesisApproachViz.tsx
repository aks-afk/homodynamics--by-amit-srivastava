import React, { useState } from 'react';

const SynthesisApproachViz: React.FC = () => {
  const [merged, setMerged] = useState(false);

  const buttonStyle: React.CSSProperties = {
      display: 'block',
      width: '100%',
      padding: '0.75rem',
      fontSize: '1rem',
      cursor: 'pointer',
      background: '#FCFBF8',
      color: '#3A3A3A',
      border: '1px solid #C1C1C1',
      borderRadius: '4px',
      fontFamily: 'Georgia, serif',
      marginTop: '1rem',
      transition: 'background 0.2s ease',
  };

  const circleBaseStyle: React.CSSProperties = {
    transition: 'all 1s cubic-bezier(0.25, 1, 0.5, 1)',
    mixBlendMode: 'multiply',
  };

  const textBaseStyle: React.CSSProperties = {
    transition: 'all 1s cubic-bezier(0.25, 1, 0.5, 1)',
  }

  return (
    <div>
      <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>The Synthesis Approach</h4>
      <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 300 220" style={{ width: '100%', height: 'auto' }}>
          <g>
            <circle
              cx={merged ? 150 : 100}
              cy="110"
              r="70"
              fill="#8A8A8A"
              opacity="0.7"
              style={circleBaseStyle}
            />
            <circle
              cx={merged ? 150 : 200}
              cy="110"
              r="70"
              fill="#5A5A5A"
              opacity="0.7"
              style={circleBaseStyle}
            />
          </g>
          <text y="105" x={merged ? 150 : 100} textAnchor="middle" fill="white" fontSize="12" style={textBaseStyle}>
              <tspan x={merged ? 150 : 100} dy="-0.6em">Ancient</tspan>
              <tspan x={merged ? 150 : 100} dy="1.2em">Wisdom</tspan>
          </text>
          <text y="105" x={merged ? 150 : 200} textAnchor="middle" fill="white" fontSize="12" style={textBaseStyle}>
              <tspan x={merged ? 150 : 200} dy="-0.6em">Modern</tspan>
              <tspan x={merged ? 150 : 200} dy="1.2em">Science</tspan>
          </text>
        </svg>
      </div>
      <button 
        onClick={() => setMerged(!merged)}
        style={buttonStyle}
      >
        {merged ? 'Separate' : 'Synthesize'}
      </button>
    </div>
  );
};

export default SynthesisApproachViz;