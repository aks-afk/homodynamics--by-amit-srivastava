export interface VisualizationConfig {
  importPath: string;
  title: string;
  description?: string;
  category: 'philosophical' | 'scientific' | 'practical' | 'domain' | 'core';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  interactionTypes: ('click' | 'drag' | 'hover' | 'keyboard' | 'slider')[];
  accessibilityFeatures: string[];
  mobileOptimized: boolean;
  loadingTime: 'fast' | 'medium' | 'slow';
  errorProne: boolean;
  loadPriority: 'high' | 'medium' | 'low';
}

export interface VisualizationRegistry {
  [key: string]: VisualizationConfig;
}

// Registry mapping component names to their import paths and metadata
// This enables lazy loading without importing all components upfront
export const visualizationRegistry: VisualizationRegistry = {
  // Core visualizations (high priority)
  'DynamicEquilibriumViz': {
    importPath: '../components/visualizations/DynamicEquilibriumViz',
    title: 'Dynamic Equilibrium',
    description: 'A system in constant motion, yet maintaining stability through continuous adaptation.',
    category: 'core',
    complexity: 'intermediate',
    interactionTypes: ['drag', 'keyboard'],
    accessibilityFeatures: ['ARIA labels', 'keyboard navigation', 'screen reader support'],
    mobileOptimized: true,
    loadingTime: 'fast',
    errorProne: false,
    loadPriority: 'high'
  },
  
  'AboutViz': {
    importPath: '../components/visualizations/AboutViz',
    title: 'About Homodynamics',
    description: 'Introduction to the Homodynamics framework',
    category: 'core',
    complexity: 'beginner',
    interactionTypes: ['hover'],
    accessibilityFeatures: ['ARIA labels', 'screen reader support'],
    mobileOptimized: true,
    loadingTime: 'fast',
    errorProne: false,
    loadPriority: 'high'
  },

  'WhatIsHomodynamicsViz': {
    importPath: '../components/visualizations/WhatIsHomodynamicsViz',
    title: 'What is Homodynamics',
    description: 'Explanation of the core concept',
    category: 'core',
    complexity: 'beginner',
    interactionTypes: ['hover'],
    accessibilityFeatures: ['ARIA labels', 'screen reader support'],
    mobileOptimized: true,
    loadingTime: 'fast',
    errorProne: false,
    loadPriority: 'high'
  },

  'IntroductionLifeViz': {
    importPath: '../components/visualizations/IntroductionLifeViz',
    title: 'Life as Dynamic Equilibrium',
    description: 'Defining life as continuous dynamic equilibrium',
    category: 'core',
    complexity: 'intermediate',
    interactionTypes: ['hover', 'click'],
    accessibilityFeatures: ['ARIA labels', 'screen reader support'],
    mobileOptimized: true,
    loadingTime: 'fast',
    errorProne: false,
    loadPriority: 'high'
  },

  'IntroductionMergeViz': {
    importPath: '../components/visualizations/IntroductionMergeViz',
    title: 'Ancient Wisdom Meets Modern Physics',
    description: 'Merging ancient philosophy with modern science',
    category: 'core',
    complexity: 'intermediate',
    interactionTypes: ['hover', 'click'],
    accessibilityFeatures: ['ARIA labels', 'screen reader support'],
    mobileOptimized: true,
    loadingTime: 'fast',
    errorProne: false,
    loadPriority: 'high'
  },

  'IntroductionFeedbackViz': {
    importPath: '../components/visualizations/IntroductionFeedbackViz',
    title: 'Dissipative Systems and Feedback',
    description: 'Understanding feedback loops and dissipative systems',
    category: 'scientific',
    complexity: 'advanced',
    interactionTypes: ['hover', 'click'],
    accessibilityFeatures: ['ARIA labels', 'screen reader support'],
    mobileOptimized: true,
    loadingTime: 'medium',
    errorProne: false,
    loadPriority: 'high'
  },
  
  'PlatosCaveViz': {
    importPath: '../components/visualizations/PlatosCaveViz',
    title: "Plato's Allegory of the Cave",
    description: 'Interactive exploration of perception, reality, and the journey from ignorance to knowledge.',
    category: 'philosophical',
    complexity: 'beginner',
    interactionTypes: ['click'],
    accessibilityFeatures: ['ARIA labels', 'state announcements', 'alternative text'],
    mobileOptimized: true,
    loadingTime: 'fast',
    errorProne: false,
    loadPriority: 'medium'
  },
  
  'ThermodynamicsViz': {
    importPath: '../components/visualizations/ThermodynamicsViz',
    title: 'Thermodynamics of Living Systems',
    description: 'How living systems maintain order by processing energy and dissipating entropy.',
    category: 'scientific',
    complexity: 'advanced',
    interactionTypes: ['click'],
    accessibilityFeatures: ['ARIA labels', 'state descriptions'],
    mobileOptimized: true,
    loadingTime: 'medium',
    errorProne: false,
    loadPriority: 'low'
  },
  
  'InformationTheoryViz': {
    importPath: '../components/visualizations/InformationTheoryViz',
    title: 'Information Theory in Biology',
    description: 'How biological systems filter signal from noise to extract meaningful information.',
    category: 'scientific',
    complexity: 'advanced',
    interactionTypes: ['click'],
    accessibilityFeatures: ['ARIA labels', 'process descriptions'],
    mobileOptimized: true,
    loadingTime: 'medium',
    errorProne: false,
    loadPriority: 'low'
  },
  
  'ComplexAdaptiveSystemsViz': {
    importPath: '../components/visualizations/ComplexAdaptiveSystemsViz',
    title: 'Complex Adaptive Systems',
    description: 'How individual agents interact to create emergent properties.',
    category: 'scientific',
    complexity: 'advanced',
    interactionTypes: ['drag', 'click'],
    accessibilityFeatures: ['ARIA labels', 'interaction descriptions'],
    mobileOptimized: true,
    loadingTime: 'slow',
    errorProne: true,
    loadPriority: 'low'
  },
  
  'NeuromodulationViz': {
    importPath: '../components/visualizations/NeuromodulationViz',
    title: 'Neurotransmitter Systems',
    description: 'Interactive exploration of how neurotransmitters modulate brain function.',
    category: 'scientific',
    complexity: 'intermediate',
    interactionTypes: ['click', 'hover'],
    accessibilityFeatures: ['ARIA labels', 'detailed descriptions'],
    mobileOptimized: true,
    loadingTime: 'medium',
    errorProne: false,
    loadPriority: 'low'
  },
  
  'EnergyDomainViz': {
    importPath: '../components/visualizations/EnergyDomainViz',
    title: 'Energy Domain: Fortitude',
    description: 'Interactive exploration of attention, vitality, focus, and flow in the energy domain.',
    category: 'domain',
    complexity: 'intermediate',
    interactionTypes: ['slider', 'click'],
    accessibilityFeatures: ['ARIA labels', 'slider descriptions', 'state announcements'],
    mobileOptimized: true,
    loadingTime: 'fast',
    errorProne: false,
    loadPriority: 'low'
  },
  
  'SpaceDomainViz': {
    importPath: '../components/visualizations/SpaceDomainViz',
    title: 'Space Domain: Adaptability',
    description: 'How environmental awareness and context switching enable adaptability.',
    category: 'domain',
    complexity: 'intermediate',
    interactionTypes: ['slider', 'click'],
    accessibilityFeatures: ['ARIA labels', 'context descriptions'],
    mobileOptimized: true,
    loadingTime: 'fast',
    errorProne: false,
    loadPriority: 'low'
  },
  
  'TimeDomainViz': {
    importPath: '../components/visualizations/TimeDomainViz',
    title: 'Time Domain: Resilience',
    description: 'Memory, learning, and stress recovery across different time scales.',
    category: 'domain',
    complexity: 'intermediate',
    interactionTypes: ['slider', 'click'],
    accessibilityFeatures: ['ARIA labels', 'temporal descriptions'],
    mobileOptimized: true,
    loadingTime: 'fast',
    errorProne: false,
    loadPriority: 'low'
  }
};

export const getVisualizationConfig = (id: string): VisualizationConfig | null => {
  return visualizationRegistry[id] || null;
};

export const getVisualizationsByCategory = (category: VisualizationConfig['category']): VisualizationConfig[] => {
  return Object.values(visualizationRegistry).filter(config => config.category === category);
};

export const getVisualizationsByComplexity = (complexity: VisualizationConfig['complexity']): VisualizationConfig[] => {
  return Object.values(visualizationRegistry).filter(config => config.complexity === complexity);
};

export const getVisualizationsByPriority = (priority: VisualizationConfig['loadPriority']): string[] => {
  return Object.keys(visualizationRegistry).filter(
    name => visualizationRegistry[name].loadPriority === priority
  );
};

export const getHighPriorityVisualizations = (): string[] => {
  return getVisualizationsByPriority('high');
};

export const preloadHighPriorityVisualizations = async (): Promise<void> => {
  const highPriorityVizs = getHighPriorityVisualizations();
  const preloadPromises = highPriorityVizs.map(async (vizName) => {
    const config = visualizationRegistry[vizName];
    if (config) {
      try {
        await import(/* @vite-ignore */ config.importPath);
      } catch (error) {
        console.warn(`Failed to preload visualization: ${vizName}`, error);
      }
    }
  });
  
  await Promise.allSettled(preloadPromises);
};

export const getAccessibleVisualizations = (): VisualizationConfig[] => {
  return Object.values(visualizationRegistry).filter(config => 
    config.accessibilityFeatures.length > 0
  );
};

export const getMobileOptimizedVisualizations = (): VisualizationConfig[] => {
  return Object.values(visualizationRegistry).filter(config => config.mobileOptimized);
};

export const getVisualizationStats = () => {
  const total = Object.keys(visualizationRegistry).length;
  const byCategory = {
    philosophical: getVisualizationsByCategory('philosophical').length,
    scientific: getVisualizationsByCategory('scientific').length,
    practical: getVisualizationsByCategory('practical').length,
    domain: getVisualizationsByCategory('domain').length,
    core: getVisualizationsByCategory('core').length
  };
  const byComplexity = {
    beginner: getVisualizationsByComplexity('beginner').length,
    intermediate: getVisualizationsByComplexity('intermediate').length,
    advanced: getVisualizationsByComplexity('advanced').length
  };
  const byPriority = {
    high: getVisualizationsByPriority('high').length,
    medium: getVisualizationsByPriority('medium').length,
    low: getVisualizationsByPriority('low').length
  };
  const accessible = getAccessibleVisualizations().length;
  const mobileOptimized = getMobileOptimizedVisualizations().length;
  
  return {
    total,
    byCategory,
    byComplexity,
    byPriority,
    accessible,
    mobileOptimized,
    accessibilityPercentage: Math.round((accessible / total) * 100),
    mobileOptimizedPercentage: Math.round((mobileOptimized / total) * 100)
  };
};