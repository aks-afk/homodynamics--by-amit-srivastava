import React from 'react';
import DynamicEquilibriumViz from './DynamicEquilibriumViz';
import withRefinedPanel from '../withRefinedPanel';

// Enhanced version of DynamicEquilibriumViz with refined panel
const RefinedDynamicEquilibriumViz = withRefinedPanel(
  DynamicEquilibriumViz,
  {
    title: 'Dynamic Equilibrium',
    description: 'A system in constant motion, yet maintaining stability through continuous adaptation and self-regulation. Drag the nodes to perturb the system and observe how it returns to equilibrium.',
    errorMessage: 'Unable to load the dynamic equilibrium simulation. This may be due to browser compatibility issues with D3.js force simulations.',
  }
);

export default RefinedDynamicEquilibriumViz;