import { Section } from '../types';
import { generateAllMetadata } from './contentAnalysis';
import LazyVisualizationWrapper from '../components/LazyVisualizationWrapper';

// Dummy component for sections without visualizations
const DummyViz = () => null;

// Helper function to create lazy visualization component
const createLazyViz = (componentName: string) => {
  return () => LazyVisualizationWrapper({ componentName });
};

// Raw content data with lazy-loaded visualizations
const rawContentData: Section[] = [
  {
    id: "about",
    title: "About Homodynamics",
    shortTitle: "About",
    component: createLazyViz('AboutViz'),
    subSections: [
      {
        id: "about-what",
        title: "What is Homodynamics?",
        content: [
          "Homodynamics is a philosophical framework that synthesizes ancient wisdom traditions with modern scientific understanding to explore the fundamental dynamics of human consciousness and experience.",
          "At its core, Homodynamics examines how human beings navigate the complex interplay between biological drives, rational thought, and spiritual aspiration—what Plato called the \"tripartite soul.\" Through interactive visualizations, the framework bridges Eastern and Western philosophical traditions, revealing universal patterns in human development and consciousness."
        ],
        component: createLazyViz('WhatIsHomodynamicsViz'),
      },
      {
        id: "about-originator",
        title: "The Originator: Amit Srivastava",
        content: [
          "Amit Srivastava is the originator and creator of the Homodynamics framework. Drawing from extensive study of philosophy, psychology, and systems theory, Amit developed Homodynamics as a bridge between ancient wisdom and contemporary challenges. His vision was to create an accessible, interactive exploration of human consciousness that transcends traditional academic boundaries and speaks directly to the human experience.",
          "Through Homodynamics, Amit seeks to illuminate the hidden patterns that shape our lives, offering both intellectual understanding and practical wisdom for navigating the complexities of modern existence."
        ],
        component: createLazyViz('OriginatorViz'),
      },
      // Add more subsections as needed...
    ]
  },
  {
    id: "introduction",
    title: "Introduction: The Core Concept of Homodynamics",
    shortTitle: "Introduction",
    component: createLazyViz('DynamicEquilibriumViz'),
    subSections: [
      {
        id: "intro-1",
        title: "Defining Life as Dynamic Equilibrium",
        content: [
          "The concept of Homodynamics, as articulated by Amit Srivastava, presents a profound re-framing of what it means to be alive. It posits that life is not a static, fixed state of being, but rather a continuous process of <strong>dynamic equilibrium</strong>. This perspective challenges traditional notions of stability as a passive condition, instead portraying it as an active, ongoing process of adaptation and regulation. In a world characterized by perpetual change and flux, living systems maintain their coherence and identity not by resisting change, but by skillfully navigating it. This <u>\"continuous dance of stability maintained through change\"</u> is the central tenet of Homodynamics. It suggests that the very essence of life lies in its ability to balance the forces of order and chaos, to remain stable while constantly evolving. This concept is not merely a modern scientific theory but is deeply rooted in ancient philosophical traditions that have long recognized the transient and ever-changing nature of existence. By viewing life through this lens, Homodynamics offers a powerful framework for understanding the complex interplay of forces that govern living organisms, from the cellular level to the complexities of human consciousness and society. It is a perspective that emphasizes resilience, adaptability, and the inherent interconnectedness of all living things."
        ],
        component: createLazyViz('IntroductionLifeViz'),
      },
      {
        id: "intro-2",
        title: "Merging Ancient Philosophy with Modern Physics",
        content: [
          "Homodynamics is a unique intellectual construct that seeks to bridge the gap between ancient wisdom and modern scientific understanding. It achieves this by merging the profound insights of age-old philosophical traditions with the precise, mathematical language of modern physics and systems theory. This synthesis reveals a remarkable convergence of ideas, showing that many ancient thinkers, from both Western and Eastern traditions, had an intuitive grasp of the principles that govern complex, living systems. For example, <strong>Plato's theory of the soul</strong>, the <strong>Buddhist concept of suffering</strong>, and the <strong>Vedic idea of prāṇa</strong> all contain elements that can be mapped onto modern concepts like <strong>feedback loops</strong>, <strong>attractor states</strong>, and <strong>non-equilibrium thermodynamics</strong>. By looking through the \"physicist's lens,\" these ancient wisdoms are not seen as mere metaphors or mystical beliefs, but as early, phenomenological statements about the fundamental nature of reality. Homodynamics, therefore, serves as a powerful tool for re-evaluating and re-contextualizing ancient philosophy, demonstrating its enduring relevance and its surprising alignment with the cutting-edge discoveries of contemporary science. This interdisciplinary approach enriches both fields, offering a more holistic and integrated understanding of life, mind, and the universe."
        ],
        component: createLazyViz('IntroductionMergeViz'),
      },
      {
        id: "intro-3",
        title: "The Relevance of Dissipative Systems and Feedback Loops",
        content: [
          "The theoretical framework of Homodynamics is heavily informed by key concepts from modern physics and systems theory, particularly the ideas of <strong>dissipative systems</strong> and <strong>feedback loops</strong>. Dissipative systems are open systems that maintain their structure and function by continuously exchanging energy and matter with their environment. Living organisms are quintessential examples of dissipative systems, as they constantly take in nutrients, expel waste, and interact with their surroundings to sustain their internal order. This process of maintaining a state of <strong>low entropy</strong> (high organization) in the face of a constantly changing environment is a hallmark of life. Feedback loops, both positive and negative, are the mechanisms through which this regulation is achieved. <strong>Negative feedback loops</strong> work to dampen fluctuations and maintain stability, while <strong>positive feedback loops</strong> can amplify small changes, leading to growth, transformation, or, in some cases, instability. Homodynamics posits that these concepts are not just abstract mathematical models but are the very principles that underlie the dynamic equilibrium of life. From the regulation of body temperature to the complex dynamics of social interaction, feedback loops are the invisible threads that weave together the fabric of living systems. By understanding life through the lens of dissipative systems and feedback loops, Homodynamics provides a powerful and precise language for describing the intricate dance of stability and change that defines existence."
        ],
        component: createLazyViz('IntroductionFeedbackViz'),
      }
    ]
  },
  // Add more sections as needed...
];

// Generate metadata for all sections
export const contentData = generateAllMetadata(rawContentData);

// Preload high-priority visualizations
export const preloadCriticalVisualizations = async () => {
  const { preloadHighPriorityVisualizations } = await import('./visualizationRegistry');
  await preloadHighPriorityVisualizations();
};

// Export individual sections for route-based code splitting
export const getSection = (sectionId: string): Section | undefined => {
  return contentData.find(section => section.id === sectionId);
};

export const getSectionsByCategory = (category: string): Section[] => {
  // This could be extended to categorize sections
  return contentData.filter(section => 
    section.metadata?.keywords?.includes(category)
  );
};

export default contentData;