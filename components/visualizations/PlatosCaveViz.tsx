import React, { useState, useEffect, useRef } from 'react';
import { addVisualizationAccessibility, announceStateChange } from '../../utils/visualizationAccessibility';

const PlatosCaveViz: React.FC = () => {
  const [isOutside, setIsOutside] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      addVisualizationAccessibility(svgRef.current, {
        title: "Plato's Allegory of the Cave",
        description: isOutside 
          ? 'The enlightened view showing the world of forms - real objects casting shadows, representing true knowledge and understanding beyond mere appearances.'
          : 'The cave scene showing prisoners seeing only shadows on the wall, representing limited perception and mistaking appearances for reality.',
        alternativeText: isOutside
          ? 'A bright scene showing three-dimensional objects (circle, square, triangle) above their shadows, with text "The World of Forms" prominently displayed.'
          : 'A dark cave scene with a fire casting shadows of objects onto a wall, with text "The Shadows of Reality" and prisoners viewing only the shadows.'
      });
    }
  }, [isOutside]);

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

  return (
    <div>
      <h4 style={{marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Plato's Cave</h4>
      <svg 
        ref={svgRef}
        viewBox="0 0 300 250" 
        style={{ width: '100%', height: 'auto', background: '#F1F0EC', borderRadius: '4px' }}
      >
        {/* Cave Wall */}
        <path d="M 20 230 Q 150 280 280 230 L 290 20 L 10 20 Z" fill="#EAE8E1" />
        
        {/* Fire */}
        <ellipse cx="150" cy="240" rx="40" ry="10" fill="#E8B57C" opacity={isOutside ? 0.1 : 0.6} style={{transition: 'opacity 0.5s'}} />
        <ellipse cx="150" cy="240" rx="20" ry="5" fill="#FADE99" opacity={isOutside ? 0.1 : 0.8} style={{transition: 'opacity 0.5s'}} />

        {/* Real Objects */}
        <g opacity={isOutside ? 1 : 0.2} style={{transition: 'opacity 0.5s, transform 0.5s', transform: isOutside ? 'translateY(-10px)' : 'translateY(0)'}}>
            <circle cx="80" cy="210" r="10" fill="#5A5A5A" />
            <rect x="140" y="200" width="20" height="20" fill="#5A5A5A" />
            <polygon points="220,220 230,200 240,220" fill="#5A5A5A" />
        </g>
        
        {/* Shadows on the wall */}
        <g opacity={isOutside ? 0 : 1} style={{transition: 'opacity 0.5s, transform 0.5s', transform: isOutside ? 'scale(0.8)' : 'scale(1.2)', transformOrigin: 'center'}}>
            <ellipse cx="80" cy="100" rx="15" ry="3" fill="#8A8A8A" />
            <rect x="138" y="98" width="24" height="4" fill="#8A8A8A" />
            <polygon points="218,104 225,98 232,104" fill="#8A8A8A" />
        </g>
        
        {/* Text Label */}
        <text x="150" y="40" textAnchor="middle" fill="#5A5A5A" fontSize="14" fontFamily="Georgia" opacity={isOutside ? 0 : 1} style={{transition: 'opacity 0.5s'}}>
          The Shadows of Reality
        </text>
         <text x="150" y="150" textAnchor="middle" fill="#3A3A3A" fontSize="16" fontFamily="Georgia" fontWeight="bold" opacity={isOutside ? 1 : 0} style={{transition: 'opacity 0.5s'}}>
          The World of Forms
        </text>
      </svg>
      <button 
        onClick={() => {
          const newState = !isOutside;
          setIsOutside(newState);
          announceStateChange(newState 
            ? 'Ascended from the cave - now viewing the world of forms with real objects and true knowledge'
            : 'Returned to the cave - now viewing only shadows and limited perception'
          );
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = '#F1F0EC')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#FCFBF8')}
        style={buttonStyle}
        aria-describedby="cave-button-description"
      >
        {isOutside ? 'Return to the Cave' : 'Ascend from the Cave'}
      </button>
      <div id="cave-button-description" className="sr-only">
        {isOutside 
          ? 'Click to return to the cave and see the limited perspective of shadows on the wall'
          : 'Click to ascend from the cave and discover the true world of forms beyond the shadows'
        }
      </div>
    </div>
  );
};

export default PlatosCaveViz;