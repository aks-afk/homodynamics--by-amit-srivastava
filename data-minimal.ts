import { Section } from './types';
import React from 'react';
import AboutViz from './components/visualizations/AboutViz';
import DynamicEquilibriumViz from './components/visualizations/DynamicEquilibriumViz';

const DummyViz: React.FC = () => React.createElement('div', {
  style: { padding: '20px', background: '#f0f0f0', border: '1px solid #ccc' }
}, 'Visualization coming soon...');

const contentData: Section[] = [
  {
    id: "about",
    title: "About Homodynamics",
    shortTitle: "About",
    component: AboutViz,
    subSections: [
      {
        id: "about-what",
        title: "What is Homodynamics?",
        content: [
          "Homodynamics is a philosophical framework that synthesizes ancient wisdom traditions with modern scientific understanding to explore the fundamental dynamics of human consciousness and experience.",
          "This is a minimal test version with just the About section working."
        ]
      }
    ]
  },
  {
    id: "equilibrium",
    title: "Dynamic Equilibrium",
    shortTitle: "Equilibrium",
    component: DynamicEquilibriumViz,
    subSections: [
      {
        id: "equilibrium-intro",
        title: "Introduction to Equilibrium",
        content: [
          "Dynamic equilibrium represents the balance between opposing forces in complex systems.",
          "This section demonstrates the second working visualization."
        ]
      }
    ]
  },
  {
    id: "coming-soon",
    title: "More Sections Coming Soon",
    shortTitle: "Coming Soon",
    component: DummyViz,
    subSections: [
      {
        id: "coming-soon-content",
        title: "Future Content",
        content: [
          "More sections and visualizations will be added gradually as we verify each component works correctly.",
          "This approach ensures stability and prevents build failures."
        ]
      }
    ]
  }
];

export { contentData };
